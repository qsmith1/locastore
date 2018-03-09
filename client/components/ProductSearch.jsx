import React from 'react';
import { Link } from 'react-router-dom';
import { Alert } from 'reactstrap';
import SmallNav from './SmallNav.jsx';
import '../styles/ProductSearch.css';
import ChipInput from 'material-ui-chip-input'
import FlatButton from 'material-ui/FlatButton';

class ProductSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      term: ''
    }
    this.onChange = this.onChange.bind(this);
    this.prodsearch = this.prodsearch.bind(this);
  }

  onChange(chips) {
    this.setState({
      term: chips
    })
  }

  prodsearch() {
    this.props.onSearch(this.state.term);
  }

  render() {
    return (
      <div>
        <SmallNav />
        <div className="productSearch">
          <h3 className="randomRenderTitle">Displaying Businesses in {this.props.location}</h3>
          <div>
            <ChipInput  onChange={this.onChange} fullWidth={true} fullWidthInput={true}/>
            <Link to="/location">
              <FlatButton label="Search" onClick={this.prodsearch}/>
            </Link>
          </div>
        </div>
      </div>
    )
  }
}

export default ProductSearch;
