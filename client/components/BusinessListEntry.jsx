import React from 'react';
import axios from 'axios';
import { Route } from 'react-router-dom';
import { Card, CardImg, CardText, CardBody, CardTitle, CardLink, Button, Row, Col } from 'reactstrap';
import IconButton from 'material-ui/IconButton/';
import { CardActions, CardHeader, CardMedia } from 'material-ui/Card';
import StarRatings from './starRatings.jsx';

class BusinessListEntry extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      favorited: false,
      buttonText: 'Favorite',
      setbyProp: false
    };
    this.isFavorited = this.isFavorited.bind(this);
    this.handleFavorite = this.handleFavorite.bind(this);
    this.handleUnfavorite = this.handleUnfavorite.bind(this);
  }

  componentWillMount() {
    if (this.props.favorited && !this.state.favorited && !this.state.setByProp) {
      this.setState({
        favorited: true,
        setByProp: true
      });
    } else {
      console.log('willmount entry')
      this.isFavorited();
    }
  }

  componentDidUpdate() {
    if (this.props.favorited && !this.state.favorited && !this.state.setByProp) {
      this.setState({
        favorited: true,
        setByProp: true
      });
    } else if (!this.state.favorited) {
      this.isFavorited();
    }
  }

  isFavorited() {
    if (!this.props.favorites) {
      return;
    }
    let businessId = this.props.business.place_id;
    let userFavorites = this.props.favorites;
    for (var i = 0; i < userFavorites.length; i++) {
      if (businessId === userFavorites[i].place_id) {
        this.setState({ favorited: true });
        return;
      }
    }
  }

  handleFavorite(business) {
    axios.post('/favorite', {
      business: business
    })
    .then((res) => {
      console.log(res);
      this.setState({
        favorited: true
      });
      this.props.setNew();
    })
    .catch((err) => {
      console.log(err);
    });
  }

  handleUnfavorite(business) {
    axios.post('/unfavorite', {
      business: business
    })
    .then((res) => {
      console.log(res);
      this.setState({
        favorited: false
      });
      this.props.setNew();
    })
    .catch((err) => {
      console.log(err);
    });
  }

  imageFallback(event) {
    event.target.src = 'http://www.karunahealthfoundation.com/wp-content/uploads/2015/05/no-image.jpg';
  }

  render() {
    let favoriteComponent = null;
    if (this.props.loginStatus && this.state.favorited) {
      favoriteComponent =
        <IconButton iconStyle={{ color:'#f95b48'}} iconClassName="fa fa-heart" onClick={() => {this.handleUnfavorite(this.props.business)}} />
    } else if (this.props.loginStatus) {
      favoriteComponent =
        <IconButton iconStyle={{ color:'#f95b48'}} iconClassName="far fa-heart" onClick={() => {this.handleFavorite(this.props.business)}}/>
    }

    return (
      <Col className="business-card">
        <Card style={{height: '350px', width:'330px', padding: '5px'}}>
        <div className="card-img-wrapper" onClick={() => {this.props.handleDetail(this.props.business.place_id)}}>
          <img className="cardImg" src={this.props.business.photos} onError={this.imageFallback} />
          <div className="card-img-text">
          <p className="details-text">Discover</p>
          </div>
        </div>
          <CardBody className="cardBody">
            <CardTitle className="cardTitle">{this.props.business.name}</CardTitle>
            <StarRatings rating={this.props.business.rating}/>
            <CardText style={{margin: 0}}>{this.props.business.price}</CardText>
            <CardText className="favorite-btn">{favoriteComponent}</CardText>
          </CardBody>
        </Card>
      </Col>
    );
  }
}

export default BusinessListEntry;