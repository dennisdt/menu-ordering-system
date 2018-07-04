import pandas as pd
import pymongo
from datetime import datetime, timedelta
from calendar import monthrange
import plotly.plotly as py
import plotly.graph_objs as go
import sys, json
import os.path

from flask import Flask, jsonify, render_template, send_from_directory, session
app = Flask(__name__)

# time today
time_now = datetime.now()
# beginning of the day
time_day = datetime.combine(time_now.date(), datetime.min.time())
# beginning of the year
time_year = datetime.combine(datetime.min.date(), datetime.min.time())

# DB credentials
dbuser = "dennisdt"
dbpassword = "testing123"

# connecting to mongoDB
conn = f"mongodb://{dbuser}:{dbpassword}@ds123981.mlab.com:23981/overclocked"
client = pymongo.MongoClient(conn)
db = client.overclocked

# query for menu and convert to df
query = db.menu.find()
menu_df = pd.DataFrame(list(query))

# home route
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/get_charts/')
@app.route('/get_charts/<kind>/<interval>')
@app.route('/get_charts/<start_date>/<end_date>/<kind>/<interval>')
def get_charts(start_date=time_day, end_date=time_now, kind="Revenue", interval='Hour'):
    # function to build charts
    # defaults to daily data if no time argument is provided
    # start_time and end_time must be in datetime format

    # converts start_date and end_date to datetime objects
    if (type(start_date) is not datetime) and (type(end_date) is not datetime):
        start_date = datetime.strptime(start_date, '%Y-%m-%d')
        end_date = datetime.strptime(end_date, '%Y-%m-%d')
    elif (type(start_date) is not datetime):
        start_date = datetime.strptime(start_date, '%Y-%m-%d')
    elif (type(end_date) is not datetime):
        end_date = datetime.strptime(end_date, '%Y-%m-%d')

    if interval == "Month":
        end_day = monthrange(end_date.year, end_date.month)[1]

        start_date =  datetime(start_date.year, start_date.month, 1)
        end_date = datetime(end_date.year, end_date.month, end_day)
    
    # query for date range
    query = db.orders.find({'time_placed': {"$gte" : start_date, "$lt": end_date}})
    df = pd.DataFrame(list(query))
    
    # merge the dataframes
    merged_df = pd.merge(df, menu_df, how="inner", on="itemID")
    
    # create a new column for total price (qty * price)
    merged_df["total"] = merged_df["itemQTY"] * merged_df["price"]
    
    # groupby
    times = pd.DatetimeIndex(merged_df.time_placed)
    
    if interval == 'Hour':
        # daily groupby
        grouped = merged_df.groupby([times.hour]).sum()
        label = "Hour"
    elif interval == 'Day':
        # extract the date from "time_placed" column
        merged_df["date"] = merged_df["time_placed"].map(lambda x: x.date())
        # groupby day
        grouped = merged_df.groupby(["date"]).sum()
        label = "Day"
    elif interval == 'Month':
        # monthly groupby
        grouped = merged_df.groupby([times.month]).sum()
        label = "Month"
    else:
        # yearly groupby
        grouped = merged_df.groupby([times.year]).sum()
        label = "Year"
        
    # to be moved or modified
    '''
    if (end_date - start_date) <= (end_date - (datetime.now() - timedelta(days=7))):
        # daily groupby
        grouped = merged_df.groupby([times.hour]).sum()
        label = "Hour"
    elif (end_date - start_date) <= (end_date - (datetime.now() - timedelta(days=31))):
        # weekly groupby
        grouped = merged_df.groupby([times.day]).sum()
        label = "Day"
    elif (end_date - start_date) <= (end_date - (datetime.now() - timedelta(days=365))):
        # monthly groupby
        grouped = merged_df.groupby([times.month]).sum()
        label = "Month"
    else:
        # yearly groupby
        grouped = merged_df.groupby([times.year]).sum()
        label = "Year"
    '''
    
    if kind == 'Quantity':
        # x and y values for quantity
        x_val=grouped["itemQTY"].index.tolist()
        y_val=grouped["itemQTY"].tolist()
        
    else: 
        # x and y values for revenue
        x_val=grouped["total"].index.tolist()
        y_val=grouped["total"].tolist()
        
    '''    
    # output figure
    fig = dict(
        data = [go.Bar(
                x=x_val,
                y=y_val,
                marker=dict(
                    color='rgb(158,202,225)',
                    line=dict(
                        color='rgb(8,48,107)',
                        width=1.5),
                ),
                opacity=0.6
            )],

        layout = {
          "hovermode": "closest", 
          "margin": {
            "r": 10, 
            "t": 25, 
            "b": 40, 
            "l": 60
          }, 
          "title": f"{kind} vs {label}", 
          "xaxis": {
            "title": f"{label}"
          }, 
          "yaxis": {
            "title": f"{kind}"
          }
        }
    )
    '''
    data = {"x": list(map(int, x_val)), "y": y_val, "kind": kind, "label": label}
    return jsonify(data)

@app.route('/get_top_items/')
@app.route('/get_top_items/<kind>/<interval>')
@app.route('/get_top_items/<start_date>/<end_date>/<kind>/<interval>')
def get_top_items(start_date=(time_now - timedelta(days=7)), end_date=time_now, kind="Revenue", interval="Hour"):

    # converts start_date and end_date to datetime objects
    if (type(start_date) is not datetime) and (type(end_date) is not datetime):
        start_date = datetime.strptime(start_date, '%Y-%m-%d')
        end_date = datetime.strptime(end_date, '%Y-%m-%d')
    elif (type(start_date) is not datetime):
        start_date = datetime.strptime(start_date, '%Y-%m-%d')
    elif (type(end_date) is not datetime):
        end_date = datetime.strptime(end_date, '%Y-%m-%d')

    if interval == "Month":
        end_day = monthrange(end_date.year, end_date.month)[1]

        start_date =  datetime(start_date.year, start_date.month, 1)
        end_date = datetime(end_date.year, end_date.month, end_day)
    
    # query for date range
    query = db.orders.find({'time_placed': {"$gte" : start_date, "$lt": end_date}})
    df = pd.DataFrame(list(query))
    
    # merge the dataframes
    merged_df = pd.merge(df, menu_df, how="inner", on="itemID")
    
    # create a new column for total price (qty * price)
    merged_df["total"] = merged_df["itemQTY"] * merged_df["price"]
    
    # Aggregate data and add back in item names
    top_item_df = merged_df.groupby('itemID').sum()
    top_item_df.reset_index(inplace=True)
    top_item_df = pd.merge(top_item_df, menu_df, how="inner", on="itemID")
    
    if kind == "Revenue":
        # revenue sorted
        top_item_df.sort_values(by=['total'], ascending=False, inplace=True)
        x_val=top_item_df["title"].tolist()
        y_val=top_item_df["total"].tolist()
    else:
        # qty
        top_item_df.sort_values(by=['itemQTY'], ascending=False, inplace=True)
        x_val=top_item_df["title"].tolist()
        y_val=top_item_df["itemQTY"].tolist()
        
    '''
    # item vs revenue
    fig = dict(
        data = [go.Bar(
                x=x_val,
                y=y_val,
                text=list(top_item_df["itemID"]),
                marker=dict(
                    color='rgb(158,202,225)',
                    line=dict(
                        color='rgb(8,48,107)',
                        width=1.5),
                ),
                opacity=0.6
            )],

        layout = {
          "hovermode": "closest", 
          "margin": {
            "r": 10, 
            "t": 25, 
            "b": 60, 
            "l": 60
          }, 
          "title": f"{kind} vs Items", 
          "xaxis": {
            "domain": [0, 1], 
            "title": "Item"
          }, 
          "yaxis": {
            "domain": [0, 1], 
            "title": f"{kind}"
          }
        }
    )
    '''
    data = {"x": x_val, "y": y_val, "kind": kind, "itemID": list(map(int, top_item_df["itemID"].tolist()))}
    return jsonify(data)
@app.route('/get_perf_report/')
@app.route('/get_perf_report/<start_date>/<end_date>/<interval>')
def get_perf_report(start_date=time_day, end_date=time_now, interval='Hour'):
    # converts start_date and end_date to datetime objects
    if (type(start_date) is not datetime) and (type(end_date) is not datetime):
        start_date = datetime.strptime(start_date, '%Y-%m-%d')
        end_date = datetime.strptime(end_date, '%Y-%m-%d')
    elif (type(start_date) is not datetime):
        start_date = datetime.strptime(start_date, '%Y-%m-%d')
    elif (type(end_date) is not datetime):
        end_date = datetime.strptime(end_date, '%Y-%m-%d')

    # if the file already exists then return it else generate a new one
    if os.path.isfile(f'reports/performance/{start_date.date()}_{end_date.date()}_{interval}_report.xlsx'):
        return send_from_directory('reports/performance/', f'{start_date.date()}_{end_date.date()}_{interval}_report.xlsx', as_attachment=True) 
    else:

        # if interval is month, round to end_time to end of month and start_time to beginning of month
        if interval == "Month":
            end_day = monthrange(end_date.year, end_date.month)[1]

            start_date =  datetime(start_date.year, start_date.month, 1)
            end_date = datetime(end_date.year, end_date.month, end_day)

        # query for date range
        query = db.orders.find({'time_placed': {"$gte" : start_date, "$lt": end_date}})
        df = pd.DataFrame(list(query))

        # merge the dataframes
        merged_df = pd.merge(df, menu_df, how="inner", on="itemID")

        # create a new column for total price (qty * price)
        merged_df["revenue"] = merged_df["itemQTY"] * merged_df["price"]

        # groupby
        times = pd.DatetimeIndex(merged_df.time_placed)
        merged_df["month"] = merged_df["time_placed"].map(lambda x: datetime.strftime(x, "%Y-%m"))

        if interval == 'Hour':
            # daily groupby
            grouped = merged_df.groupby([times.hour]).sum()
            grouped["unique_customers"] = merged_df.groupby([times.hour]).nunique()["customerID"]
        elif interval == 'Day':
            # extract the date from "time_placed" column
            merged_df["date"] = merged_df["time_placed"].map(lambda x: x.date())
            # groupby day
            grouped = merged_df.groupby(["date"]).sum()
            grouped["unique_customers"] = merged_df.groupby(["date"]).nunique()["customerID"]
        elif interval == 'Month':
            # monthly groupby
            grouped = merged_df.groupby(["month"]).sum()
            grouped["unique_cust"] = merged_df.groupby(["month"]).nunique()["customerID"]
        else:
            # yearly groupby
            grouped = merged_df.groupby([times.year]).sum()
            grouped["unique_customers"] = merged_df.groupby([times.year]).nunique()["customerID"]

        grouped.drop(['itemID', 'orderID', 'price'], axis=1, inplace=True)
        
        # save to excel
        grouped.to_excel(f'reports/performance/{start_date.date()}_{end_date.date()}_{interval}_report.xlsx', sheet_name="Sheet1")
        
        # output link to download
        return send_from_directory('reports/performance/', f'{start_date.date()}_{end_date.date()}_{interval}_report.xlsx', as_attachment=True)

@app.route('/get_item_report/')
@app.route('/get_item_report/<start_date>/<end_date>/<kind>/<interval>')
def get_item_report(start_date=time_year, end_date=time_now, kind='Revenue', interval='Hour'):
    # converts start_date and end_date to datetime objects
    if (type(start_date) is not datetime) and (type(end_date) is not datetime):
        start_date = datetime.strptime(start_date, '%Y-%m-%d')
        end_date = datetime.strptime(end_date, '%Y-%m-%d')
    elif (type(start_date) is not datetime):
        start_date = datetime.strptime(start_date, '%Y-%m-%d')
    elif (type(end_date) is not datetime):
        end_date = datetime.strptime(end_date, '%Y-%m-%d')

    if os.path.isfile(f'reports/items/{str(start_date.date())}_{str(end_date.date())}_items_by_{kind}_report.xlsx'):
        return send_from_directory('reports/items/', f'{str(start_date.date())}_{str(end_date.date())}_items_by_{kind}_report.xlsx', as_attachment=True)
    else:

        # if interval is month, round to end_time to end of month and start_time to beginning of month
        if interval == "Month":
            end_day = monthrange(end_date.year, end_date.month)[1]

            start_date =  datetime(start_date.year, start_date.month, 1)
            end_date = datetime(end_date.year, end_date.month, end_day)
        
        # query for date range
        query = db.orders.find({'time_placed': {"$gte" : start_date, "$lt": end_date}})
        df = pd.DataFrame(list(query))
        
        # merge the dataframes
        merged_df = pd.merge(df, menu_df, how="inner", on="itemID")
        
        # create a new column for total price (qty * price)
        merged_df["revenue"] = merged_df["itemQTY"] * merged_df["price"]
        
        # Aggregate data and add back in item names
        top_item_df = merged_df.groupby('itemID').sum()
        top_item_df.reset_index(inplace=True)
        top_item_df = pd.merge(top_item_df, menu_df, how="inner", on="itemID")
        
        cols_to_keep = ["itemID", "title", "type", "revenue", "itemQTY"]
        
        if kind == "Revenue":
            # revenue sorted
            top_item_df.sort_values(by=['revenue'], ascending=False, inplace=True)
            
            # save to excel
            top_item_df[cols_to_keep].to_excel(f'reports/items/{str(start_date.date())}_{str(end_date.date())}_items_by_{kind}_report.xlsx', sheet_name='Sheet1', index=False)
            
        else:
            # qty sorted
            top_item_df.sort_values(by=['itemQTY'], ascending=False, inplace=True)
            
            # save to excel
            top_item_df[cols_to_keep].to_excel(f'reports/items/{str(start_date.date())}_{str(end_date.date())}_items_by_{kind}_report.xlsx', sheet_name='Sheet1', index=False)

        # output link to download
        return send_from_directory('reports/items/', f'{str(start_date.date())}_{str(end_date.date())}_items_by_{kind}_report.xlsx', as_attachment=True)

if __name__ == "__main__":
    app.run(debug=True)