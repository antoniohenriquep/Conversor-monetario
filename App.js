import React, {useEffect, useState} from 'react';
import { View, Text,StyleSheet,TextInput,TouchableOpacity, ActivityIndicator, Keyboard } from 'react-native';
import Picker from './src/Components/Picker';
import { api } from './src/services/api';
export default function App() {

  const [moedas, setMoedas] = useState([])
  const [loading, setLoading] = useState(true)

  const [moedaSelA, setMoedaSelA] = useState(null)
  const [moedaSelB, setMoedaSelB] = useState(null)

  const [moedaAValor, setMoedaAValor] = useState(0)
  const [moedaBValor, setMoedaBValor] = useState(0)

  const [valorMoeda, setValorMoeda] = useState(null)
  const [valorConv, setValorConv] = useState(0)

  useEffect(() =>{
    async function loadMoedas(){
      const response = await api.get('all')

      //console.log(Object.keys(response.data))

      let arrayMoedas = []
      Object.keys(response.data).map((key) =>{
        arrayMoedas.push({
          key: key,
          label: key,
          value: key
        })
        //console.log(arrayMoedas)
      })

      arrayMoedas.push({
        key: "BRL",
        label: "BRL",
        value: "BRL"
      })
      
      setMoedas(arrayMoedas)
      setLoading(false)
    }


    loadMoedas()
  },[])


  async function converter(){
    if(moedaSelA === null || moedaSelB === null || moedaBValor === 0){
      if(moedaSelA === null ||moedaSelB === null)
        alert('Por favor, selecione uma moeda!')
      else alert('Por favor, digite uma quantia!')
      return
    }
    //Devolve quanto é um dolar convertido para reais
    const response = await api.get(`all/${moedaSelA}-${moedaSelB}`)
    //console.log(response.data[moedaSel].ask)

    let resultado = (parseFloat(moedaBValor) * parseFloat(response.data[moedaSelA].ask))
    setValorConv(`${resultado.toFixed(2)} ${moedaSelB}`)
    setValorMoeda(moedaBValor)
    setMoedaAValor(moedaSelA)

    Keyboard.dismiss()
  }


  if(loading){
    return(<View style ={{flex:1, alignItems:'center', justifyContent:'center',backgroundColor:'#101215'}}>
      <ActivityIndicator color = '#fff' size ={60}/>
    </View>)
  }

  
  else{
    return (
      <View style = {style.container}>
        
        <View style = {style.areaMoeda}>
          <Text style = {style.titulo}>Converter de:</Text>
          <Picker moedas ={moedas} onChange ={(moeda) => setMoedaSelA(moeda)}/>
        </View>

        <View style = {style.areaMoeda}>
          <Text style = {style.titulo}>Para:</Text>
          <Picker moedas ={moedas} onChange ={(moeda) => setMoedaSelB(moeda)}/>
        </View>

        <View style ={style.areaValor}>
          <Text style = {style.titulo}>Digite um valor para converter:</Text>
          <TextInput 
          placeholder = 'Ex. 100'
          style ={style.input}
          keyboardType='numeric'
          onChangeText = {(valor) => {setMoedaBValor(valor)}}/>
        </View>

        <TouchableOpacity style={style.btnArea} onPress ={converter}>
          <Text style={style.btnTexto}>Converter</Text>
        </TouchableOpacity>

        {valorConv !== 0 && (
          <View style={style.areaResultado}>
          <Text style={style.textoResultado}>{valorMoeda} {moedaAValor}</Text>
          <Text style={[style.textoResultado,{fontSize:18,margin:10}]}>Corresponde a:</Text>
          <Text style={style.textoResultado}>{valorConv}</Text>
          </View>
        )}

      </View>
    );
  }
}

const style = StyleSheet.create({
  container:{
    flex:1,
    alignItems:'center',
    backgroundColor:'#101215',
    paddingTop:40
  },
  areaMoeda:{
    width:'90%',
    backgroundColor:'#f9f9f9',
    paddingTop:9,
    marginBottom:2
  },
  titulo:{
    fontSize:15,
    color:'#000',
    paddingTop:5,
    paddingLeft:5
  },
  areaValor:{
    width: '90%',
    backgroundColor:'#f9f9f9',
    paddingBottom:8,
    paddingTop:8
  },
  input:{
    width:'100%',
    padding:10,
    height:45,
    fontSize:20,
    marginTop:9,
    color:'#111'
  },
  btnArea:{
    width:'90%',
    backgroundColor:'#fb4b57',
    height: 45,
    borderBottomLeftRadius:9,
    borderBottomRightRadius:9,
    justifyContent:'center',
    alignItems:'center'
  },
  btnTexto:{
    fontSize:18,
    fontWeight:'bold'
  },
  areaResultado:{
    width:'90%',
    marginTop:35,
    backgroundColor:'#fff',
    alignItems:'center',
    justifyContent:'center',
    padding: 25
  },
  textoResultado:{
    fontSize:39,
    fontWeight:'bold'

  }
})