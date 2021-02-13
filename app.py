import os
# Heroku check
is_heroku = False
if 'IS_HEROKU' in os.environ:
    is_heroku = True
import pandas as pd
import json
from flask import Flask, jsonify, render_template
# SQL Alchemy
from sqlalchemy import create_engine
# PyMySQL 
import pymysql
pymysql.install_as_MySQLdb()
# Import your config file(s) and variable(s)
if is_heroku == True:
    # if IS_HEROKU is found in the environment variables, then use the rest
    # NOTE: you still need to set up the IS_HEROKU environment variable on Heroku (it is not there by default)
    remote_db_endpoint = os.environ.get('remote_db_endpoint')
    remote_db_port = os.environ.get('remote_db_port')
    remote_db_name = os.environ.get('remote_db_name')
    remote_db_user = os.environ.get('remote_db_user')
    remote_db_pwd = os.environ.get('remote_db_pwd')
else:
    # Config variables
    from config import remote_db_endpoint, remote_db_port
    from config import remote_db_name, remote_db_user, remote_db_pwd
# Import Pandas
import pandas as pd
#%%
#################################################
# Flask Setup
#################################################
#instantiate an app
app = Flask(__name__)
#%%
#################################################
# Flask Routes
#################################################
#%%
#default route
@app.route("/")
def home():
    return render_template('index.html')
#%%
@app.route("/test")
def test():
    return render_template('test.html')
#%%
@app.route("/linechart")
def linechart():
    return render_template('linechart.html')
#%%
#explore route
@app.route("/explore")
def explore():
    return render_template('explore.html')
#%%
#documentation route
@app.route("/documentation")
def documentation():
    return render_template('documentation.html')
        
#%%
#api route
@app.route("/api")
def api_list():
    """List all available api routes."""
    return (
        f"Available Routes:<br/>"
        f"/api/ncr_counties_expenditures<br/>"
        f"/api/geojson/ncr<br/>"
    )
#%%
@app.route("/api/ncr_counties_expenditures_jared")
def fairfax(): 
    # Cloud MySQL Database Connection on AWS
    cloud_engine_2 = create_engine(f"mysql://{remote_db_user}:{remote_db_pwd}@{remote_db_endpoint}:{remote_db_port}/{remote_db_name}")
    # Create a remote database engine connection
    cloud_conn_2 = cloud_engine_2.connect()
    # read in from AWS
    query_2 = '''
        SELECT
            c.fiscal_year,
            c.bin,
            MAX(m.expenditures_ytd) AS montgomery,
            MAX(f.expenditures_ytd) AS fairfax,
            MAX(a.expenditures_ytd) AS arlington,
            MAX(l.expenditures_ytd) AS loudoun,
            MAX(pw.expenditures_ytd) AS prince_william,
            MAX(pg.expenditures_ytd) AS prince_george
        FROM        
            ncr_county_expenditures c
            LEFT JOIN 
                (
                        SELECT
                            fiscal_year,
                            bin,
                            SUM(expenditures_ytd) AS expenditures_ytd
                        FROM
                            ncr_county_expenditures
                        WHERE
                            county = "Montgomery"
                        GROUP BY
                            fiscal_year, bin
                    ) AS m
            ON c.fiscal_year = m.fiscal_year 
            AND c.bin = m.bin
            LEFT JOIN 
                (
                        SELECT
                            fiscal_year,
                            bin,
                            SUM(expenditures_ytd) AS expenditures_ytd
                        FROM
                            ncr_county_expenditures
                        WHERE
                            county = "Fairfax"
                        GROUP BY
                            fiscal_year, bin
                    ) AS f
            ON c.fiscal_year = f.fiscal_year 
            AND c.bin = f.bin
            LEFT JOIN 
                (
                        SELECT
                            fiscal_year,
                            bin,
                            SUM(expenditures_ytd) AS expenditures_ytd
                        FROM
                            ncr_county_expenditures
                        WHERE
                            county = "Arlington"
                        GROUP BY
                            fiscal_year, bin
                    ) AS a
            ON c.fiscal_year = a.fiscal_year 
            AND c.bin = a.bin
            LEFT JOIN 
                (
                        SELECT
                            fiscal_year,
                            bin,
                            SUM(expenditures_ytd) AS expenditures_ytd
                        FROM
                            ncr_county_expenditures
                        WHERE
                            county = "Prince William"
                        GROUP BY
                            fiscal_year, bin
                    ) AS pw
            ON c.fiscal_year = pw.fiscal_year 
            AND c.bin = pw.bin
            LEFT JOIN 
                (
                        SELECT
                            fiscal_year,
                            bin,
                            SUM(expenditures_ytd) AS expenditures_ytd
                        FROM
                            ncr_county_expenditures
                        WHERE
                            county = "Loudoun"
                        GROUP BY
                            fiscal_year, bin
                    ) AS l
            ON c.fiscal_year = l.fiscal_year 
            AND c.bin = l.bin
            LEFT JOIN 
                (
                        SELECT
                            fiscal_year,
                            bin,
                            SUM(expenditures_ytd) AS expenditures_ytd
                        FROM
                            ncr_county_expenditures
                        WHERE
                            county = "Prince George's"
                        GROUP BY
                            fiscal_year, bin
                    ) AS pg
            ON c.fiscal_year = pg.fiscal_year 
            AND c.bin = pg.bin
        GROUP BY 
            c.bin,
            c.fiscaL_year
        ORDER BY
            fiscal_year
        '''
    ncr_county_2 = pd.read_sql(query_2, cloud_conn_2)
    # ncr_county
    # Opening JSON file 
    # f = open('static/data/fairfax_data.json',)
    # fairfax_data = json.load(f)
    return ncr_county_2.to_json(orient="records")
    cloud_conn_2.close()
    cloud_engine_2.dispose()
#%%
@app.route("/api/geojson/ncr")
def geojson(): 
    # Opening JSON file 
    f = open('static/data/scoped_counties_info.geojson',)
    county_map = json.load(f)
    return jsonify(county_map)
#%%
@app.route("/css/core")
def core_css(): 
    # Opening JSON file 
    f = open('static/css/core.css',)
    core = json.load(f)
    return core
@app.route("/County info")
def countysorted():
    return render_template('county info.html')

@app.route("/alldata")
def alldata():
    return render_template('alldata.html')

#%%
@app.route("/api/ncr_counties_expenditures")
def angela(): 
    # Cloud MySQL Database Connection on AWS
    cloud_engine = create_engine(f"mysql://{remote_db_user}:{remote_db_pwd}@{remote_db_endpoint}:{remote_db_port}/{remote_db_name}")
    # Create a remote database engine connection
    cloud_conn = cloud_engine.connect()
    #read in from AWS
    query = '''
        SELECT *
        FROM ncr_county_expenditures
        '''
    ncr_county = pd.read_sql(query, cloud_conn)
    # ncr_county
    # Opening JSON file 
    # f = open('static/data/fairfax_data.json',)
    # fairfax_data = json.load(f)
    return ncr_county.to_json(orient="records")
    cloud_conn.close()
    cloud_engine.dispose()
#%%
if __name__ == '__main__':
    app.run(debug=True)

 