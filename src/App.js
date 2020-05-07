import React, { useState, useEffect } from "react";

import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import api from "./services/api";

function Repository({ data: repository, handleLikeRepository }) {
  return (
    <View style={styles.repositoryContainer}>
      <Text style={styles.repository}>{repository.title}</Text>

      <View style={styles.techsContainer}>
        {repository.techs.map((item) => (
          <Text style={styles.tech} key={String(item)}>
            {item}
          </Text>
        ))}
      </View>

      <View style={styles.likesContainer}>
        <Text
          style={styles.likeText}
          testID={`repository-likes-${repository.id}`}
        >
          {repository.likes} curtidas
        </Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => handleLikeRepository(repository.id)}
        testID={`like-button-${repository.id}`}
      >
        <Text style={styles.buttonText}>Curtir</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function App() {
  const [repositories, setRepositories] = useState([]);

  useEffect(() => {
    async function loadRepositories() {
      try {
        const response = await api.get("/repositories");

        setRepositories(response.data);
      } catch (error) {
        Alert.alert(
          "Erro",
          "Erro ao carregar repositórios, cheque sua conexão"
        );
      }
    }

    loadRepositories();
  }, []);
  async function handleLikeRepository(id) {
    try {
      const { data } = await api.post(`/repositories/${id}/like`);

      const index = repositories.findIndex((repo) => repo.id === id);

      const reposList = [...repositories];
      reposList[index] = data;

      setRepositories(reposList);
    } catch (error) {
      Alert.alert("Erro", "Erro ao curtir um repositório, cheque sua conexão");
    }
  }

  return (
    <>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
        <FlatList
          data={repositories}
          renderItem={({ item }) => (
            <Repository
              data={item}
              handleLikeRepository={handleLikeRepository}
            />
          )}
          keyExtractor={(item) => String(item.id)}
        />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7159c1",
  },
  repositoryContainer: {
    marginBottom: 15,
    marginHorizontal: 15,
    backgroundColor: "#fff",
    padding: 20,
  },
  repository: {
    fontSize: 32,
    fontWeight: "bold",
  },
  techsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  tech: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 10,
    backgroundColor: "#04d361",
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: "#fff",
  },
  likesContainer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  likeText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
  },
  button: {
    marginTop: 10,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
    color: "#fff",
    backgroundColor: "#7159c1",
    padding: 15,
  },
});
