import { StatusBar } from 'expo-status-bar';
import React, {useEffect, useState} from "react";
import { StyleSheet, Text, View, Dimensions, TextInput, Button, Alert } from 'react-native';
import MapView, {Callout, Marker} from 'react-native-maps';
import * as Location from 'expo-location'

export default function App() {

  const[location, setLocation] = useState(null)
 

  const [adress, setAdress] = useState('Haaga-Helia Pasila Campus');
  const [search, setSearch] = useState();
  const [latitude, setLatitude] = useState(60.201373);
  const [longitude, setLongitude] = useState(24.934041);
  const [key, setKey] = useState('gJohapAZaMTqC9IsPXN9r4Uh1QHS6fZf');
  const [results, setResults] = useState([]);

  useEffect(()=>{
    (async()=>{
        let{status} = await Location.requestForegroundPermissionsAsync();
        if(status !== 'granted'){
            Alert.alert('No permission to get location')
            return;
        }
        let location = await Location.getCurrentPositionAsync({});
        setLocation(location)
        setLongitude(location.coords.longitude)
        setLatitude(location.coords.latitude)

        getDataReverse(location.coords.latitude, location.coords.longitude)
      
    })();
  },[]);

  const getDataReverse=(lat, lng)=>{
    fetch('https://www.mapquestapi.com/geocoding/v1/reverse?key='+key+'&location='+lat+'%2C'+lng+'&outFormat=json&thumbMaps=false')
    .then(response=> response.json())
    .then (data => getAdress(data))
    .catch(error =>{
      Alert.alert('Error occurred', error);
    });
  }

  
  const searchAdress=()=>{
    let searchword = search
    setAdress(searchword)
    getData(searchword)
  }

  

  const getData=(searchword)=>{  
    fetch('https://www.mapquestapi.com/geocoding/v1/address?key=GhOhfnf7u89otxqJk6OBVJbKAGE91vGF&inFormat=kvp&outFormat=json&location='+searchword+'%2CHelsinki%2CFI&thumbMaps=false&maxResults=1')
    .then(response=> response.json())
    .then (data => getCoords(data))
    .catch(error =>{
      Alert.alert('Error occurred', error);
    });
  }

  const getCoords=(data)=>{
    let lat = data.results[0].locations[0].displayLatLng.lat
    let lng = data.results[0].locations[0].displayLatLng.lng
    setLatitude(lat)
    setLongitude(lng)
  }

  const getAdress=(data)=>{
    let street = data.results[0].locations[0].street
    setAdress(street)
  }



  return (
    <View style={styles.container}>
      <MapView
      style={styles.map}
      region={{
        latitude: latitude,
        longitude: longitude,
        latitudeDelta: 0.0322,
        longitudeDelta: 0.0221,
      }}>
        <Marker
          coordinate={{
            latitude: latitude,
            longitude:longitude}}
            title={adress}/>

      
        </MapView>

        <View style={styles.mapOverlay}>
          <TextInput style={styles.input} onChangeText={text=>setSearch(text)}/>
          <Button title="SEARCH" onPress={(search)=>searchAdress(search)}></Button>
        </View>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  }, 
  mapOverlay: {
    position:'absolute',
    bottom:20,
    width: Dimensions.get('window').width,
    alignItems:'center'
  },
  input:{
    width:200,
    marginTop:20,
    marginBottom:20,
    backgroundColor:'white',
    borderColor:'gray',
    borderWidth:1
  },
});
