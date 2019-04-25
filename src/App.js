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

        const sortedByInk = response.data.sort((a, b) => b.ink - a.ink);
        const first1000 = sortedByInk.slice(0, 1000);

        first1000.map(cdp => {
          return this.state.getUrls.push(axios.get(`https://mkr.tools/api/v1/cdp/${cdp.id}/actions`));
        });
      })
      .then(() => {
        axios.all(this.state.getUrls)
          .then(response => {
            response.map(cdp => {
              return cdp.data.forEach(row => {
                this.state.allObjects.push(row);
              })
            })
          })
          .then(() => {
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
