import React, { Component } from 'react';
import axios from "axios";
import './App.css';
import CircularProgress from '@material-ui/core/CircularProgress';

class App extends Component {

  state = {
    spinner: true,
    rows: null,
    getUrls: [],
    allObjects: []
  }

  componentDidMount() {
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
