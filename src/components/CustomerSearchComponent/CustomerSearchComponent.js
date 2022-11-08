import React, { Component } from 'react';
import {createCustomer} from '../../helpers/firestoreUtils';
import './CustomerSearchComponent.css';


class CustomerSearchComponent extends Component {
    constructor(props) {
      super(props);
      this.state = {
        searchNumber : props.searchNumber,
      };
      this.handleChange = this.handleChange.bind(this);
    }
  
    handleChange(e) {
      this.setState({
        [e.target.name] : e.target.value
      })
    }
  
    render() {

        return (
          <div>
            <table>
                <tr>
                    <td> <label>Search number </label></td><td><input type="text" id="searchNumberId" name="searchNumber" value={this.state.searchNumber} placeholder="Phone number" onChange={this.handleChange} /></td>
                </tr>
                <tr>
                    <td><button class="SearchCustomerButton" onClick={ () => {this.props.handlePhoneChange(this.state.searchNumber)}}>Search</button></td><td></td>
                </tr>
            </table>
              {/* <label>Search number: <input type="text" id="searchNumberId" name="searchNumber" value={this.state.searchNumber} placeholder="Phone number" onChange={this.handleChange} /> </label>
              <br></br>
              <br></br> */}
              {/* <button class="SearchCustomerButton" onClick={ () => {this.props.handlePhoneChange(this.state.searchNumber)}}>Search</button> */}
          </div>
        );      
    }
  }
  export default CustomerSearchComponent;
  