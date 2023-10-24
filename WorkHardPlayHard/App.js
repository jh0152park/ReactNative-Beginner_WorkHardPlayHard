import { StatusBar } from "expo-status-bar";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Alert,
} from "react-native";
import { theme } from "./color";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Fontisto } from "@expo/vector-icons";

const STORAGE_KEY = "@action_items";

export default function App() {
    const [work, setWork] = useState(true);
    const [input, setInput] = useState("");
    const [actionItem, setActionItem] = useState({});

    function onWorkPress() {
        setWork(true);
    }

    function onPlayPress() {
        setWork(false);
    }

    function onChangeText(item) {
        setInput(item);
    }

    async function addActionItem() {
        if (input === "") {
            return;
        }

        const newActionItem = Object.assign({}, actionItem, {
            [Date.now()]: { item: input, work: work },
        });

        setActionItem(newActionItem);
        await saveActionItem(newActionItem);
        setInput("");
    }

    async function saveActionItem(actionItems) {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(actionItems));
    }

    async function getActionItem() {
        const data = await AsyncStorage.getItem(STORAGE_KEY);
        setActionItem(JSON.parse(data));
        return data !== null ? JSON.parse(data) : null;
    }

    function deleteActionItem(id) {
        Alert.alert("Do you really want to delete it?", "", [
            { text: "Cancel", style: "destructive" },
            {
                text: "Ok",
                onPress: async () => {
                    const newActionItem = { ...actionItem };
                    delete newActionItem[id];

                    setActionItem(newActionItem);
                    await saveActionItem(newActionItem);
                },
            },
        ]);

        return;
    }

    useEffect(() => {
        getActionItem();
    }, []);

    return (
        <View style={styles.container}>
            <StatusBar style="auto" />
            <View style={styles.header}>
                <TouchableOpacity onPress={onWorkPress}>
                    <Text
                        style={{
                            ...styles.buttonText,
                            color: work ? "whitesmoke" : theme.gray,
                        }}
                    >
                        Work
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onPlayPress}>
                    <Text
                        style={{
                            ...styles.buttonText,
                            color: !work ? "whitesmoke" : theme.gray,
                        }}
                    >
                        Play
                    </Text>
                </TouchableOpacity>
            </View>

            <TextInput
                onSubmitEditing={addActionItem}
                onChangeText={onChangeText}
                value={input}
                placeholder={work ? "What you gonna do?" : "Let's play!"}
                placeholderTextColor={"black"}
                returnKeyType="done"
                style={styles.input}
            />

            <ScrollView>
                {Object.keys(actionItem).map((key) =>
                    actionItem[key].work === work ? (
                        <View key={key} style={styles.actionItem}>
                            <Text style={styles.actionItemText}>
                                {actionItem[key].item}
                            </Text>
                            <TouchableOpacity
                                onPress={() => deleteActionItem(key)}
                            >
                                <Fontisto name="trash" size={24} color="grey" />
                            </TouchableOpacity>
                        </View>
                    ) : null
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.background,
        paddingHorizontal: 20,
    },
    header: {
        flexDirection: "row",
        marginTop: 100,
        justifyContent: "space-between",
    },
    buttonText: {
        fontSize: 35,
        fontWeight: "bold",
    },
    input: {
        backgroundColor: "whitesmoke",
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 30,
        marginVertical: 50,
        fontSize: 15,
    },

    actionItem: {
        backgroundColor: theme.gray,
        marginBottom: 10,
        paddingVertical: 25,
        paddingHorizontal: 30,
        borderRadius: 15,
        flexDirection: "row",
        justifyContent: "space-between",
        alignContent: "center",
    },
    actionItemText: {
        color: "whitesmoke",
        fontSize: 20,
        fontWeight: "bold",
    },
});
