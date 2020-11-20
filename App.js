import React from 'react';
import {
  SafeAreaView,StyleSheet,ScrollView,
  View,Text,Button, Alert
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';

//aqui importamos o asyncStorage
// para instalar a lib no seu projeto use o seguinte comando: 
//yarn add @react-native-async-storage/async-storage
//pode ser usado com "npm install" tbm
// se o seu react native for da versão 0.60 ou superior é só isso
//caso o contrário precisa linkar manualmente com:
//react-native link @react-native-async-storage/async-storage
import AsyncStorage from '@react-native-async-storage/async-storage';



const salvarDados = async (value) => {
  console.log("output da função salvarDados--------------------------------------");
  //para usar o async Storage é preciso anilhá-lo em bloco try-catch, como mostrado abaixo.
  //também precisamos usar uma função asincrona e utilizar a flag await já que todas as funções
  // do Async Storage retornam promisses, ou seja, precisamos esperar para a função ser resolvida.
  try {
    //para salvar um valor string, basta escolher a chave e chamar a função
    await AsyncStorage.setItem('@chave', value, () => {
      /*aqui nós podemos chamar uma função para executar dps de salvar*/
      console.log("valor salvo");
    })
  } catch (e) {
    console.log("Deu ruim", e);
  }

  try {
    //se quisermos salvar um objeto, primeiro precisamos transformá-lo 
    //em texto com JSON.stringfy

    //objeto qualquer
    const obj = {nome: "Batata", ocupacao:"ser um tuberculo"};

    //tranformando objeto em em string
    const jsonValue = JSON.stringify(obj)

    //chamar a setItem sem problemas
    await AsyncStorage.setItem('@chaveObj', jsonValue, () => {
      console.log("objeto: " + obj);
      console.log("objeto em string: " + jsonValue);
      console.log("objeto salvo");
    })
  } catch (e) {
    console.log("Deu ruim", e);
  }
  console.log();
}

const recuperarDados = async () => {
  console.log("output da função recuperarDados--------------------------------------");
  //para recuperar o valor da chave basta consultá-la
  try {
    const value = await AsyncStorage.getItem('@chave')
    if(value !== null) {
      console.log("valor resgatado: "+ value);
    }
  } catch(e) {
    console.log("Deu ruim");
  }

  try {
    //para objetos precisamos traduzi-los devolta para JSON com JSON.parse
    const jsonValue = await AsyncStorage.getItem('@chaveObj')
    const obj = JSON.parse(jsonValue);
    console.log("Objeto recuperado: " + obj);

  } catch(e) {
    console.log("Deu ruim");
  }
  console.log();
}

const misturaDados = async () => {
  console.log("output da função misturaDados--------------------------------------");
  try {
    //temos o objeto @chaveObj com os seguintes dados: {nome: "batata", ocupacao: "ser um tuberculo"}
    //vamos atualizar sua ocupacao e dar outra característica
    const obj2 = {ocupacao: "corredor", cabelo: "careca"};

    //agora vamos misturar os dois objetos
    await AsyncStorage.mergeItem('@chaveObj', JSON.stringify(obj2))

    //vamos pegar o obj salvo pra ver o resultado
    const obj = await AsyncStorage.getItem('@chaveObj')

    console.log("objeto resultante de getItem (note que está em forma de string ainda): " + obj);

    //OBS: podemos fazer isso com string tbm, mas não é muito útil
  }
  catch(e){
    console.log("Deu ruim");
  }
  console.log();
}

const apagaValor = async () => {
  console.log("output da função apagaValor--------------------------------------");
  //agora digamos q o usuário deletou seu aplicativo pra baixar tik tok, primeiro você respira e se acalma,
  //mas dps vc tem que apagar os dados salvos no celular, para isso é só passar a chave que que deletar
  try {
    await AsyncStorage.removeItem('@chave', () => {
      console.log('Apagado com sucesso');
    })
  } catch(e) {
    console.log("Deu ruim");
  }

  try {
    await AsyncStorage.removeItem('@chaveObj', () => {
      console.log('objeto apagado com sucesso');
    })
  } catch(e) {
    console.log("Deu ruim");
  }
  console.log();
}

const salvaVariosValores = async () => {
  console.log("output da função salvaVariosValores--------------------------------------");
  //com o multiSet nós podemos salvar varios pares chave valor ao mesmo tempo
  //podemos salvar declarando-os antes ou diretamente no comando
  let obj1 = JSON.stringify({nome:"Batatinha"});
  let obj2 = JSON.stringify({nome:"Batatona"})
  const umPar = ["@chave1", obj1];
  const outroPar = ["@chave2", obj2];
  const extra = ["@chave3", "oioioi"]; // usaremos em outro exemplo
  try {
    await AsyncStorage.multiSet([umPar, outroPar, extra]);

  } catch(e) {
    console.log("Deu ruim");
  }

  console.log("Salvo com sucesso");
  console.log();
}

const recuperaVariosValores = async () => {
  console.log("output da função recuperaVariosValores--------------------------------------");
  //aqui nós vamos recuperar os valores salvos nas chaves que indicamos,
  //esses valores podem ter sidos salvos pelo setItem, mergeItem ou multiSet
  let valores;
  try {
    values = await AsyncStorage.multiGet(['@chave1', '@chave2'])
  } catch(e) {
    console.log("Deu ruim");
  }
  console.log("valores resgatados: " + values);
  console.log();

}

const misturavariosValores = async () => {
  console.log("output da função misturavariosValores--------------------------------------");
  //aqui nós vamos usar o multiMerge para atualizar dois pares chave valor ao mesmo tempo
  let misturado;

  //chaves que vão ser atualizadas e os valores que vão entrar no lugar
  const multiMerge = [
    ["@chave1", JSON.stringify({nome:"oioioi"})],
    ["@chave2", JSON.stringify({nome:"eieieie"})]
  ]
  try {
    await AsyncStorage.multiMerge(multiMerge, () => {
      misturado = AsyncStorage.multiGet(['@chave1', '@chave2'])
    });
  } catch(e) {
    console.log("Deu ruim");
  }

  console.log("Valores atualizados " + misturado[0] + " " + misturado[1]);
  console.log();
}

const removevariosValores = async () => {
  console.log("output da função removevariosValores--------------------------------------");
  //aqui nos vamos remover as duas chaves que criamos no passo anterior 
  const keys = ['@chave1', '@chave2']
  try {
    //dps de remover, podemos usar o parâmetro callback para chamar um dos
    //itens deletados. Como eles não existem mais, a função getItem vai retornar null
    await AsyncStorage.multiRemove(keys, () => {
      AsyncStorage.getItem('@chave1', (err, result) => {
        console.log("Resultado " + result);
        console.log("erro "+err);
      });
    });
  } catch(e) {
    console.log("Deu ruim");
  }

  console.log('Itens apagados');
  console.log();
}

const recuperaChaves = async () => {
  console.log("output da função recuperaChaves--------------------------------------");
  let chaves = []
  try {
    chaves = await AsyncStorage.getAllKeys()
  } catch(e) {
    console.log("Deu ruim");
  }

  console.log("chaves esquecidas: " + chaves);
  console.group();
}

const apagaTudo = async () => {
  //essa função apaga toda a memória do asyncStorage
  try {
    await AsyncStorage.clear()
  } catch(e) {
    console.log("Deu ruim");
  }

  console.log('Não acretido que vc realmente chamou a função =(');
}


const App: () => React$Node = () => {
  return (
    <>
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          
          <View style={styles.body}>

            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Adicionando um novo valor</Text>
              <Text style={styles.sectionDescription}>
                Para adicionar um valor utilizaremos o comando 
                <Text style={styles.highlight}> setItem</Text>
              </Text>

              <Button
                onPress={() => salvarDados("Batata")}
                title="salvar um valor persistentemente"
                color="green"
                accessibilityLabel="Botao para salvar um valor"
              />

            </View>

            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Recuperar o valor</Text>
              <Text style={styles.sectionDescription}>
                Agora que já salvamos aquele valor. Precismos recuperá-lo, se não meio que é inutil salvar
                pra começo de conversa. Para salvar a valor, utilizaremos o comando 
                <Text style={styles.highlight}> getItem</Text>
              </Text>

              <Button
                onPress={() => recuperarDados()}
                title="recuperar o valor salvo"
                color="green"
                accessibilityLabel="Botao para recuperar um valor"
              />

            </View>

            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Atualizar o valor</Text>
              <Text style={styles.sectionDescription}>
                Agora que já sabemos salvar e ler o valor da memória, precisamos aprender como atualizá-lo.
                Afinal, nada é pra sempre hehehe. Para isso vamos usar o comando 
                <Text style={styles.highlight}> mergeItem</Text>
              </Text>

              <Button
                onPress={() => misturaDados()}
                title="atualizar um valor"
                color="green"
                accessibilityLabel="Botao para atualizar um valor"
              />

            </View>

            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Deletar o valor</Text>
              <Text style={styles.sectionDescription}>
                Bom, tudo que é bom dura pouco, sei que você deve ter se apegado ao valor,
                afinal, vocẽs tem uma longa história de uns 10 minutos =). Mas agora é hora de dizer tchau =(.
                Pra isso vamos usar o comando  
                <Text style={styles.highlight}> removeItem</Text>
              </Text>

              <Button
                onPress={() => apagaValor()}
                title="apagar o valor =("
                color="green"
                accessibilityLabel="Botao para apagar um valor"
              />

            </View>

            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Adicionar Varios novos valores</Text>
              <Text style={styles.sectionDescription}>
                Sei que foi dificil dar tchau. Mas agora temos muitos valores!!!! E podemos salvar todos eles
                 com o comando 
                <Text style={styles.highlight}> multiSet</Text>
              </Text>

              <Button
                onPress={() => salvaVariosValores()}
                title="salvar uma porrada de valor"
                color="green"
                accessibilityLabel="Botao para salvar valor até não poder mais"
              />

            </View>

            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Recuperando varios valores</Text>
              <Text style={styles.sectionDescription}>
                Agora que salvamos varios valores, vamos buscar todos eles tbm, né?
                Da pra fazer isso com 
                <Text style={styles.highlight}> multiGet</Text>
              </Text>

              <Button
                onPress={() => recuperaVariosValores()}
                title="recupera varios valores"
                color="green"
                accessibilityLabel="recupera tudo os valor"
              />

            </View>

            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Misturando varios valores</Text>
              <Text style={styles.sectionDescription}>
                Agora nós podemos também querer atualizar vários valores ao mesmo tempo,
                para isso podemos usar o comando 
                <Text style={styles.highlight}> multiMerge</Text>
              </Text>

              <Button
                onPress={() => misturavariosValores()}
                title="atualizar varios dados de uma vez"
                color="green"
                accessibilityLabel="Botao para atualizar multiplos dados"
              />

            </View>

            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Deletando varios valores</Text>
              <Text style={styles.sectionDescription}>
                Beleza, agora estamos quase no final e já a prendemos a usar as
                diferentes formas de salvar  recuperar dados, mas também podemos deletar varios
                dados de uma vez. para isso usaremos o 
                <Text style={styles.highlight}> multiRemove</Text>
              </Text>

              <Button
                onPress={() => removevariosValores()}
                title="deletar varios valores"
                color="green"
                accessibilityLabel="Botao para deletar varios valores"
              />

            </View>

            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Recuperando chaves esquecidas</Text>
              <Text style={styles.sectionDescription}>
                Beleza, até agora salvamos, recuperamos e deletamos vários valores.
                Será que não esquecemos de nenhum?~{"\n"}
                Para saber isso podemos usar o comando
                <Text style={styles.highlight}> getAllKeys</Text> 
              </Text>

              <Button
                onPress={() => recuperaChaves()}
                title="recuperar chaves"
                color="green"
                accessibilityLabel="Botao para achar chaves esquecidas"
              />

            </View>
                  
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>O fim de tudo</Text>
              <Text style={styles.sectionDescription}>
                Agora pra acabar, podemos usar um comando que apaga toda a memória
                do AsyncStorage, é o comando
                <Text style={styles.highlight}> clear </Text>
                Recomendo que nao utilize esse comando já que ele apaga o asyncStorage de todas
                as aplicacções do seu celular. Inclusive outros projetos. 
              </Text>

              <Button
                onPress={() => Alert.alert('Não acredito que apertou', "mas relaxa, n vai acontecernada. A função ta implementada lá nas funções do App.js, mas não é chamada em lugar nenhum")}
                title="apaga tudo (Não aperte)"
                color="red"
                accessibilityLabel="Botao para acabar com tudo"
              />

            </View>

          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
    padding: 5,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
