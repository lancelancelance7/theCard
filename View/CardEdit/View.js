import React, {useEffect, useRef, useState} from 'react';
import {View, TextInput, TouchableOpacity, Alert} from "react-native";
import {connect} from "react-redux";
import {CButton, NormalText, ShadowCard} from "../../components";
import styles from "./style";
import { getDatabase, ref, set, push } from "firebase/database";
import moment from "moment";
import {colors} from "../../globalVariables";
import CardPicker from "./CardPicker.";
import {cardStyles} from "../../CardStyles";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
// import { TextInput } from "@react-native-material/core";


function CardEdit({...props}) {
    const db = getDatabase();
    const textInputRef = useRef()
    const [content, setContent] = useState('I am a card')
    const [postButtonLoading, setPostButtonLoading] = useState(false)
    useEffect(() => {
        // console.log('hello')
    }, []);
    const onContentChange = (text) =>{
        setContent(text)
    }
    const onPost = async () =>{
        setPostButtonLoading(true)
        const time = moment().unix()
        const reqData = {
            content: content,
            time: time,
            authorID: props.userID,
            active:true,
            cardStyle:props.cardStyleID
        }
        try {
            const cardID = `${props.userID}_${time}`
            await set(ref(db, `cards/${cardID}`), reqData)
            await set(ref(db, 'users/' + props.userID + '/cards/' + cardID), {
                content: content.slice(0, 20),
                cardStyle:props.cardStyleID,
                active: true
            })
            alert('Your card has been post!')
        }catch (e) {
            alert('post failed')
            console.error(e)
        }
        setPostButtonLoading(false)
    }
    const onPostPress = async () =>{
        Alert.alert('Post your card', 'You can not edit your card once it is post',[
            {
                text:'Cancel',
                onPress: ()=>{},
                style: 'cancel'
            },
            {
                text:'Yes',
                onPress: ()=>{
                    onPost()
                }
            }
        ])
    }
    return (
        <View style={styles.container}>
            <NormalText style={styles.title}>Say something</NormalText>
            <View style={{flex:1, width:'100%'}}>
                <CardPicker/>
            </View>
            <ShadowCard style={[styles.cardContainer, cardStyles[props.cardStyleID].card]}>
                <TextInput ref={textInputRef} style={cardStyles[props.cardStyleID].text} multiline={true} value={content} onChangeText={onContentChange} editable={!postButtonLoading}/>
            </ShadowCard>
            <View style={{height:20}}/>
            <View style={{flex:1}}>
                <CButton onPress={onPostPress} title={'Post'} loading={postButtonLoading}/>
            </View>
        </View>
    );
}

const mapState = (state) => {
    return {
        userID: state.user.userID,
        cardStyleID: state.cardEdit.cardStyleID,
    }
}
const mapDispatch = (dispatch) => {
    return {
        // setCompanyId(res){
        //     const action = setCompanyIdAction(res)
        //     dispatch(action)
        // },
    }
}
export default connect(mapState, mapDispatch)(CardEdit);