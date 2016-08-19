/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Animated,
  TouchableOpacity,
} from 'react-native';


import Dimensions from 'Dimensions';

const windowWidth = Dimensions.get('window').width;
const windowHeight = windowWidth*1714/750;
const SCROLL1TOP = -205; //scroll 1 容器的初始位置
const SCROLL2TOP = -137; //scroll 2 容器的初始位置
const SCROLL3TOP = -69;  //scroll 3 容器的初始位置
const SCROLLITEM =  69;
const WORDPOSITION = 266;
const SCROLL1REF = 'SCROLL1REF';
const SCROLL2REF = 'SCROLL2REF';
const SCROLL3REF = 'SCROLL3REF';
const CONTAINER = 'CONTAINER';
const WORDCONTAINER = 'WORDCONTAINER';
class prizedraw extends Component {

  constructor(props: any) {
    super(props);
    this._startShake = this._startShake.bind(this);
    this._rotateAnimated = this._rotateAnimated.bind(this);
    this._rebackShake = this._rebackShake.bind(this);
    this._startScroll = this._startScroll.bind(this);
    this._refSet = this._refSet.bind(this);
    this._startScrollActurally = this._startScrollActurally.bind(this);
    this._startWordAnimate = this._startWordAnimate.bind(this);
    this._desc = this._desc.bind(this);
    this._rotate = 0;
    this._time = null;
    this._prizenum = 3;
    this.state = {
        transformYValue: new Animated.Value(0),
        rotateXValue: 0,
    };
  }
  componentDidMount() {
    this._startWordAnimate(0.05);
  }
  _rebackShake() {
      var nowtime = Date.now();
      var detatime = nowtime - this._time;
      this._time = nowtime;
      this._rotate -= detatime * 0.09;
      if(this.state.rotateXValue <0) {
        return;
      }else{
        this.setState({
          rotateXValue: this._rotate
        })
        requestAnimationFrame(this._rebackShake);
      }
  }
  _rebackTrans() {
      Animated.timing(this.state.transformYValue, {
           toValue: 0 ,
           duration: 500,  
     }).start();
  }
  _rotateAnimated() {
      var nowtime = Date.now();
      var detatime = nowtime - this._time;
      this._time = nowtime;
      this._rotate += detatime * 0.09;
      if(this._rotate > 45 ) {
        this._rebackShake();
        this._rebackTrans();
        return;
      }else{
        this.setState({
          rotateXValue: this._rotate
        })
        requestAnimationFrame(this._rotateAnimated);
      }

  }
  _setLeft(refer,value) {
    this.refs[refer].setNativeProps({
             style: {
                transform:[{translateX: value}]
             }
       })
  }

  _startWordAnimate(speed) {
      let wordTime = Date.now();
      let leftObject = 0;
      let wordRefer = WORDCONTAINER;
      const self = this;
      const wordAnimated = function() {
          var nowtime = Date.now();
          var detatime = nowtime - wordTime;
          wordTime = nowtime;
          leftObject -= detatime * speed;
          if(Math.abs(leftObject) > 1000) {
              leftObject = WORDPOSITION;
              requestAnimationFrame(wordAnimated);
          }else{
              
             self._setLeft(wordRefer,leftObject);
             requestAnimationFrame(wordAnimated);
              
        }
      }
      wordAnimated();
  }
  _startShake() {
    if(this._prizenum === 3) {
       this._prizenum = 0;
       Animated.timing(this.state.transformYValue, {
           toValue: 20 ,
           duration: 500,  
       }).start();

      this._time = Date.now();
      this._rotateAnimated();
      this._startScroll();
    }
    
  }
  _refSet(refer,props) {
    this.refs[refer].setNativeProps({
             style: {
                transform:[{translateY: props}]
             }
       })
  }
  _desc() {
      this.refs.CONTAINER.scrollTo({x: 0, y: 160, animated: true})
  }
  _startScrollActurally(id,speed,cyclecount) {
      let scrollTime = Date.now();
      let scrollObject = null;
      let scrollRefer = null;
      let count = 0;
      if(id === 1) {
          scrollObject = SCROLL1TOP;
          scrollRefer = SCROLL1REF;
      }
      if(id === 2) {
          scrollObject = SCROLL2TOP;
          scrollRefer = SCROLL2REF;
      }
      if(id === 3) {
          scrollObject = SCROLL3TOP;
          scrollRefer = SCROLL3REF;
      }
      const self = this;
      const scroll = function() {
          var nowtime = Date.now();
          var detatime = nowtime - scrollTime;
          scrollTime = nowtime;
          scrollObject += detatime * speed;
          if(scrollObject > 0) {
              scrollObject = SCROLL1TOP;
              count++;
              requestAnimationFrame(scroll);
          }else{
              if(count > cyclecount) {
                  let tal = SCROLLITEM - Math.abs(scrollObject)%SCROLLITEM;
                  scrollObject = scrollObject-tal;
                  self._refSet(scrollRefer,scrollObject);
                  self._prizenum++;
                  return;
              }else{
                  self._refSet(scrollRefer,scrollObject);
                  requestAnimationFrame(scroll);
              }
        }
      }
      scroll();
  }
 
  _startScroll() {
      let cyclecount = Math.floor(Math.random() * 5) + 25;
      this._startScrollActurally(1,4,cyclecount);
      //cyclecount = Math.floor(Math.random() * 5) + 20;
      setTimeout(this._startScrollActurally,1000,2,2,cyclecount);
      //cyclecount = Math.floor(Math.random() * 5) + 15;
      setTimeout(this._startScrollActurally,2000,3,1,cyclecount);
  }
  render() {

    return (

      <ScrollView style={styles.container} ref={CONTAINER}>
        <Image source={require('./assets/prize_bg.jpg')} style={styles.scene} >
           <View style={styles.prizeScrollContainer}>
               <View style={{flexDirection:'row',justifyContent:'space-between',position:'absolute',left:0,height:40,alignItems:'center',marginRight: 20,backgroundColor:'transparent',transform:[{translateX:WORDPOSITION}]}} ref={WORDCONTAINER}>
                      <Text style={styles.word}>这是一段文字1</Text>
                      <Text style={styles.word}>这是一段文字2</Text>
                      <Text style={styles.word}>这是一段文字3</Text>
                      <Text style={styles.word}>这是一段文字4</Text>
                      <Text style={styles.word}>这是一段文字5</Text>
                </View>
           </View>
           <TouchableOpacity onPress={this._desc}  activeOpacity={1} >
               <View style={styles.desc}>
               </View>
            </TouchableOpacity>
          <View style={styles.prizeBingo}>
             <View style={styles.prizeBingoContainer}>
                <Animated.View style={{transform:[{translateY:SCROLL1TOP}], 
                                        position: 'absolute',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between',
                                        width: 69, }}  
                                        ref = {SCROLL1REF}>
                    <Image source={require('./assets/scroll_item_1.png')}  style={styles.prizeLevel} />
                    <Image source={require('./assets/scroll_item_2.png')}  style={styles.prizeLevel} />
                    <Image source={require('./assets/scroll_item_3.png')}  style={styles.prizeLevel} />
                    <Image source={require('./assets/scroll_item_1.png')}  style={styles.prizeLevel} />
                    <Image source={require('./assets/scroll_item_2.png')}  style={styles.prizeLevel} />
                    <Image source={require('./assets/scroll_item_3.png')}  style={styles.prizeLevel} />
                </Animated.View>
             </View>
             <View style={styles.prizeBingoContainer}>
                <Animated.View style={{transform:[{translateY:SCROLL2TOP}], 
                                        position: 'absolute',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between',
                                        width: 69, }}  
                                        ref = {SCROLL2REF}>
                   <Image source={require('./assets/scroll_item_1.png')}  style={styles.prizeLevel} />
                    <Image source={require('./assets/scroll_item_2.png')}  style={styles.prizeLevel} />
                    <Image source={require('./assets/scroll_item_3.png')}  style={styles.prizeLevel} />
                    <Image source={require('./assets/scroll_item_1.png')}  style={styles.prizeLevel} />
                    <Image source={require('./assets/scroll_item_2.png')}  style={styles.prizeLevel} />
                    <Image source={require('./assets/scroll_item_3.png')}  style={styles.prizeLevel} />
                </Animated.View>
             </View>
             <View style={styles.prizeBingoContainer}>
                <Animated.View style={{transform:[{translateY:SCROLL3TOP}], 
                                        position: 'absolute',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between',
                                        width: 69, }}  
                                        ref = {SCROLL3REF}>
                    <Image source={require('./assets/scroll_item_1.png')}  style={styles.prizeLevel} />
                    <Image source={require('./assets/scroll_item_2.png')}  style={styles.prizeLevel} />
                    <Image source={require('./assets/scroll_item_3.png')}  style={styles.prizeLevel} />
                    <Image source={require('./assets/scroll_item_1.png')}  style={styles.prizeLevel} />
                    <Image source={require('./assets/scroll_item_2.png')}  style={styles.prizeLevel} />
                    <Image source={require('./assets/scroll_item_3.png')}  style={styles.prizeLevel} />
                </Animated.View>
             </View>
          </View>
          <TouchableOpacity onPress={this._startShake}  activeOpacity={1} >
            <Animated.Image source={require('./assets/btn_start.png')}  style={[styles.starbtn,{transform:[{translateY:this.state.transformYValue},{rotateX:this.state.rotateXValue +'deg'}]}]} />
          </TouchableOpacity>
        </Image>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#F5FCFF',
  },
  scene: {
    width: windowWidth,
    height:windowHeight,
  },
  starbtn: {
    position: 'absolute',
    width: 30,
    height: 79,
    left: 260,
    top: 295,
  },
  prizeBingo: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'center',
    width: 209,
    height: 173,
    left: 35,
    top: 248,
    overflow: 'hidden',
  },
  prizeBingoContainer: {
    width: 69,
    height: 173,
  },
  prizeLevel: {
    width: 69,
    height: 69,
  },
  desc: {
    position: 'absolute',
    width: 55,
    height: 40,
    left: 250,
    top: 175,
    opacity: 0,
  },
  prizeScrollContainer: {
    position: 'absolute',
    width: 236,
    height: 40,
    left: 12,
    top: 172,
    overflow: 'hidden',
  },
  word: {
    marginRight: 20,
    fontSize: 20,
    color: '#88F1F6',
    backgroundColor: 'transparent'
  }
});

AppRegistry.registerComponent('prizedraw', () => prizedraw);
