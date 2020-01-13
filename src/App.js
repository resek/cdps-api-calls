import React, { Component } from 'react';
import axios from "axios";
import './App.css';
import CircularProgress from '@material-ui/core/CircularProgress';

class App extends Component {

  state = {
    spinner: true,
    rows: null,
    getUrls: [],
    ids: [3088,
      153543,
      12826,
      1238,
      14357,
      13917,
      99779,
      5144,
      5422,
      3647,
      4004,
      2554,
      4166,
      5141,
      51,
      17074,
      16707,
      2283,
      16671,
      4865,
      784,
      15860,
      16515,
      1287,
      5156,
      14960,
      16930,
      1481,
      2442,
      4225,
      16932,
      2709,
      119434,
      16978,
      356,
      135,
      153642,
      2544,
      12890,
      2873,
      2035,
      19487,
      153658,
      14869,
      153914,
      4224,
      15036,
      681,
      4265,
      19304,
      4222,
      4223,
      19357,
      603,
      14829,
      2214,
      5447,
      4969,
      16298,
      18883,
      4537,
      340,
      19064,
      14863,
      18774,
      17,
      5858,
      5000,
      2507,
      14142,
      3969,
      19328,
      14430,
      86670,
      17859,
      705,
      5459,
      14788,
      4895,
      15858,
      14691,
      18316,
      3873,
      1776,
      153570,
      147225,
      127744,
      15471,
      16014,
      147121,
      2075,
      44086,
      14975,
      16592,
      14852,
      18285,
      5162,
      3351,
      4580,
      17285],
    allObjects: []
  }

  /* componentDidMount() {
    axios.get('https://mkr.tools/api/v1/cdps')
      .then(response => {

        const sortedByBlock = response.data.sort((a, b) => b.block - a.block);
        const minus10day = sortedByBlock[0].block - 65000;
        const filterd10days = sortedByBlock.filter(cdp => cdp.block >= minus10day);        
        console.log("filtered");
        console.log(filterd10days);
        filterd10days.map(cdp => {
          return this.state.getUrls.push(axios.get(`https://mkr.tools/api/v1/cdp/${cdp.id}/actions`));
        });
      })
      .then(() => {
        axios.all(this.state.getUrls)
          .then(response => {
            console.log("response from all calls");
            console.log(response);
            response.map(cdp => {
              return cdp.data.forEach(row => {
                this.state.allObjects.push(row);
              })
            })
          })
          .then(() => {
            console.log("saving to DB")
            axios({
              url: "https://cdps-api-calls.firebaseio.com/cdps-api-calls.json",
              method: "put",
              data: this.state.allObjects
            })
            .then(response => {
              console.log(response);
              this.setState({spinner: false, rows: response.data.length});
            })
            .catch(function (error) {
              console.log(error);
            });
          })
          .catch(function (error) {
            console.log(error);
          });
      })      
      .catch(function (error) {
        console.log(error);
      });
  } */

  componentDidMount() {

  this.state.ids.forEach(id => {
    return this.state.getUrls.push(axios.get(`https://mkr.tools/api/v1/cdp/${id}/actions`));
  });

  axios.all(this.state.getUrls)
    .then(response => {
      console.log("response from all calls");
      console.log(response);
      response.map(cdp => {
        return cdp.data.forEach(row => {
          this.state.allObjects.push(row);
        })
      })
    })
    .then(() => {
      console.log("saving to DB")
      axios({
        url: "https://cdps-api-calls.firebaseio.com/cdps-api-calls.json",
        method: "put",
        data: this.state.allObjects
      })
      .then(response => {
        console.log(response);
        this.setState({spinner: false, rows: response.data.length});
      })
      .catch(function (error) {
        console.log(error);
      });
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  render() {

    return (
      <div className="App">
        {this.state.spinner ? <CircularProgress size={80} style={{marginTop: 160}}/>
        : <div style={{marginTop: 160}}>
          <div>https://cdps-api-calls.firebaseio.com/cdps-api-calls.json</div>
          <div>Rows created: {this.state.rows}</div>
        </div>} 
      </div>
    );
  }
}

export default App;
