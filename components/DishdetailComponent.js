import React, { Component } from 'react';
import { Text, View, ScrollView, FlatList, Modal, StyleSheet, Button } from 'react-native';
import { Card, Icon, Rating, Input } from 'react-native-elements';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { postFavorite, postComment } from '../redux/ActionCreators';


const mapStateToProps = state => {
    return {
        dishes: state.dishes,
        comments: state.comments,
        favorites: state.favorites,
        
    }
}

const mapDispatchToProps = dispatch => ({
    postFavorite: (dishId) => dispatch(postFavorite(dishId)),
    postComment: (dishId, rating, author, comment) => dispatch(postComment(dishId, rating, author, comment))
})

function RenderDish(props){

    
    const dish = props.dish;
    
    if(dish != null){
        return(
                <Card
                    featuredTitle= {dish.name}
                    image= {{uri: baseUrl + dish.image}}>
                        <Text style={ {margin: 10} }>
                            { dish.description }
                        </Text>
                        <View style={{flex:1, flexDirection: 'row', alignItems: 'center',
        justifyContent: 'center',}}>
                            <Icon
                            raised
                            reverse
                            name={props.favorite ? 'heart' : 'heart-o'}
                            type='font-awesome'
                            color='#f50'
                            onPress={() => props.favorite ? console.log('Already faved.')
                                                            : props.onPress()}
                        />
                        <Icon
                            raised
                            reverse
                            name="pencil"
                            type='font-awesome'
                            color='#512DA8'
                            onPress={() => props.commentOnPress()}
                        />
                        </View>
                </Card>
        );
    }
    else{
        return(<View></View>);
    }
}

function RenderComments(props){

    const comments = props.comments;

    const renderCommentItem = ({item, index}) => {
        return(
            <View key={index} style={{margin: 10}}>
                <Text style={{fontSize: 14}}>
                    {item.comment}
                </Text>
                <Text style={{fontSize: 12}}>
                    {item.rating} Stars
                </Text>
                <Text style={{fontSize: 12}}>
                    {'..' + item.author + ', ' + item.date}
                </Text>
            </View>
        );
    }

    return(
            <Card title='Comments'>
                <FlatList
                    data={comments}
                    renderItem={renderCommentItem}
                    keyExtractor={item => item.id.toString()}
                />
            </Card>
    );
}

class Dishdetail extends Component{

    constructor(props){
        super(props);

        this.state = {
            rating: 5,
            author: '',
            comment: '',
            showModal: false
        }
    }

    markAsFavorite(dishId){
        this.props.postFavorite(dishId);
    }

    static navigationOptions = {
        title: 'Dish Details'
    };

    commentSubmit(dishId){
        this.props.postComment(dishId, this.state.rating, this.state.author, this.state.comment)
        this.toggleModal()
    }

    toggleModal(){
        this.setState({showModal: !this.state.showModal});
        console.log(this.showModal)
    }

    resetForm(){
        this.setState({
            rating:5,
            author: '',
            comment: '',
            showModal: false
        });
    }

    render() {
        const dishId = this.props.navigation.getParam('dishId','');
        return(
            <ScrollView>
                <RenderDish dish={this.props.dishes.dishes[+dishId]} 
                            favorite={this.props.favorites.some(
                                el => el === dishId)}
                            onPress={() => this.markAsFavorite(dishId)}
                            commentOnPress={() => {this.toggleModal()}}
                />
                <RenderComments comments={this.props.comments.comments.filter(
                    (comment) => comment.dishId === dishId)}
                />
                <Modal
                    animationType={'slide'}
                    transparent={false}
                    visible={this.state.showModal}
                    onDismiss={() => {this.toggleModal(); this.resetForm()}}
                    onRequestClose={() => {this.toggleModal(); this.resetForm();}}
                    dishId={dishId}
                >
                    <View styles={styles.modalStyle}>
                        <Rating
                            showRating
                            onFinishRating={(rating) => this.setState({rating: rating})}
                        />
                        <Input
                            placeholder="Author"
                            leftIcon={{ type: 'font-awesome', name: 'user-o'}}
                            onChangeText = {value => this.setState({ author: value })}
                        />
                        <Input
                            placeholder='Comment'
                            leftIcon={{ type: 'font-awesome', name: 'comment-o' }}
                            onChangeText={value => this.setState({ comment: value })}
                        />
                        <View style={styles.buttons}>
                            <Button
                                onPress={() => { this.commentSubmit(dishId) }}
                                title='Submit'
                                color='#512DA8'
                                padding={24}
                                accessibilityLabel="Learn more about this submit button" />
                            <Button
                                onPress={() => { this.toggleModal(); this.resetForm() }}
                                title='Cancel'
                                color="#000"
                                padding={24}
                                accessibilityLabel="Learn more about this cancel button" />
                        </View>
                    </View>
                </Modal>
            </ScrollView>
        );
        
    }
    
}

const styles = StyleSheet.create({
    modalStyle: {
        alignItems: 'center',
        justifyContent: 'center',
        margin: 20,
    },
    buttons:{
      margin: 10,
      padding: 10
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Dishdetail);