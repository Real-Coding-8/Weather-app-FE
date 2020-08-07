import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity,SafeAreaView, View, Dimensions } from 'react-native';
import cityListApi from '../api/CityListApi';
import Carousel from 'react-native-snap-carousel';

export default class CityList extends React.Component {
  sliderHeight=Dimensions.get('window').height;
  constructor(props) {
    super(props);

    this.state = {
      activeIndex:0,
      cities: [],
    }
    this._renderItem = this._renderItem.bind(this)
  }

  componentDidMount() {
    cityListApi.fetchAvailableCities()
      .then(cities => {
        this.setState({
          cities
        });
      });
  }

  onPressCity(item) {
    console.log('onPressCity =', item);
    this.props.navigation.navigate('Detail', {
      city: item
    });
  }
  _renderItem({item, index}){
    return (
      <View style={{
          backgroundColor:'floralwhite',
          borderRadius: 5,
          marginTop : (this.sliderHeight)/4,
          height: 300,
          padding: 10,
          marginLeft: 20,
          marginRight: 20,
           }}>
        <Text style={{fontSize: 30}}>{item.title}</Text>
        <Text>{item.text}</Text>
        <TouchableOpacity style={styles.item} onPress={() => this.onPressCity(item)}>
          <Text style={styles.text}>{item}</Text>
        </TouchableOpacity>
      </View>
      

    )
}

  // renderItem(city) {
  //   return (
  //     <TouchableOpacity style={styles.item} onPress={() => this.onPressCity(city)}>
  //       <Text style={styles.text}>{city}</Text>
  //     </TouchableOpacity>
  //   );
  // }

  render() {
    return (
      // <FlatList style={styles.container}
      //           numColumns={3}
      //           renderItem={({ item }) => this.renderItem(item)}
      //           keyExtractor={item => item}
      //           data={this.state.cities}
      // />
      <SafeAreaView style={{flex: 1, backgroundColor:'#034F84', paddingTop: 50, }}>
            <View style={{ flex: 1, flexDirection:'row', justifyContent: 'center',}}>
                <Carousel
                  layout={"default"}
                  ref={ref => this.carousel = ref}
                  data={this.state.cities}
                  sliderWidth={Dimensions.get('window').width}
                  sliderHeight={Dimensions.get('window').height}
                  itemWidth={300}
                  renderItem={this._renderItem}
                  
                  onSnapToItem = { index => this.setState({activeIndex:index}) } />
            </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  item: {
    flex: 1,
    height: 50,
    justifyContent: 'center',
  },
  text: {
    fontSize: 30,
    textAlign: 'center',
    fontWeight: 'bold',
  }
});
