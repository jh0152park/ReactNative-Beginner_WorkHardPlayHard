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
import { useEffect, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Fontisto } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";

const STORAGE_KEY = "@action_items";
const STATUS_KEY = "@status";

/**
 * Challenge
 * 1. Register when was my last stay momment
 * 2. Create a new `done` feature to each item
 * 3. Edit a item
 */
export default function App() {
    const [work, setWork] = useState(true);
    const [input, setInput] = useState("");
    const [actionItem, setActionItem] = useState({});
    const [edit, setEdit] = useState(false);
    const [editKey, setEditKey] = useState();
    const inputRef = useRef();

    function onWorkPress() {
        setWork(true);
        updateStatus(true);
    }

    function onPlayPress() {
        setWork(false);
        updateStatus(false);
    }

    function onChangeText(item) {
        setInput(item);
    }

    async function updateStatus(work) {
        try {
            await AsyncStorage.setItem(
                STATUS_KEY,
                JSON.stringify(work ? "work" : "play")
            );
        } catch (e) {
            console.log(e);
        }
    }

    async function getStatus() {
        try {
            const data = await AsyncStorage.getItem(STATUS_KEY);
            if (data !== null) {
                setWork(data === '"work"');
                return data;
            }
        } catch (e) {
            console.log(e);
        }
    }

    async function addActionItem() {
        if (input === "") {
            return;
        }

        if (edit) {
            if (editKey) {
                let newActionItem = { ...actionItem };
                newActionItem[editKey].item = input;

                setActionItem(newActionItem);
                await saveActionItem(newActionItem);

                setEdit(false);
            } else {
                setEdit(false);
                return;
            }
        } else {
            const newActionItem = Object.assign({}, actionItem, {
                [Date.now()]: {
                    item: input,
                    work: work,
                    done: false,
                },
            });

            setActionItem(newActionItem);
            await saveActionItem(newActionItem);
        }
        setInput("");
    }

    async function saveActionItem(actionItems) {
        try {
            await AsyncStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(actionItems)
            );
        } catch (e) {
            console.log(e);
        }
    }

    async function getActionItem() {
        try {
            const data = await AsyncStorage.getItem(STORAGE_KEY);
            if (data !== null) {
                setActionItem(JSON.parse(data));
                return JSON.parse(data);
            }
        } catch (e) {
            console.log(e);
        }
    }

    function deleteActionItem(id) {
        Alert.alert("Do you really wanna delete it?", "", [
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

    function onDoneButtonPress(id) {
        Alert.alert("Are you reaally done?", "", [
            { text: "Cancel", style: "destructive" },
            {
                text: "Ok",
                onPress: async () => {
                    let newActionItem = { ...actionItem };
                    newActionItem[id].done = true;

                    setActionItem(newActionItem);
                    await saveActionItem(newActionItem);
                },
            },
        ]);
        return;
    }

    function onEditButtonPress(id) {
        if (edit) {
            setEdit(false);
        } else {
            setEdit(true);
            setEditKey(id);
            inputRef.current.focus();
        }
    }

    useEffect(() => {
        getStatus();
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
                ref={inputRef}
                onSubmitEditing={addActionItem}
                onChangeText={onChangeText}
                value={input}
                placeholder={
                    edit
                        ? "What you gonna to fix?"
                        : work
                        ? "What you gonna do?"
                        : "Let's play!"
                }
                placeholderTextColor={"black"}
                returnKeyType="done"
                style={styles.input}
            />

            <ScrollView>
                {Object.keys(actionItem).map((key) =>
                    actionItem[key].work === work ? (
                        <View key={key} style={styles.actionItem}>
                            <View style={styles.AIGroup}>
                                <TouchableOpacity
                                    onPress={() => onDoneButtonPress(key)}
                                >
                                    <Ionicons
                                        name="checkmark-done-sharp"
                                        size={24}
                                        color="lime"
                                    />
                                </TouchableOpacity>
                                <Text
                                    style={{
                                        ...styles.actionItemText,
                                        color: actionItem[key].done
                                            ? "lime"
                                            : "whitesmoke",
                                    }}
                                >
                                    {actionItem[key].item}
                                </Text>
                            </View>

                            <View style={styles.AIGroup}>
                                <TouchableOpacity
                                    style={{ marginRight: 10 }}
                                    onPress={() => onEditButtonPress(key)}
                                >
                                    <FontAwesome5
                                        name="edit"
                                        size={24}
                                        color="#FFB300"
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => deleteActionItem(key)}
                                >
                                    <Fontisto
                                        name="trash"
                                        size={24}
                                        color="grey"
                                    />
                                </TouchableOpacity>
                            </View>
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
        paddingHorizontal: 15,
        borderRadius: 15,
        flexDirection: "row",
        justifyContent: "space-between",
        alignContent: "center",
    },
    actionItemText: {
        fontSize: 20,
        fontWeight: "bold",
        marginLeft: 10,
    },

    AIGroup: {
        flexDirection: "row",
        justifyContent: "center",
        alignContent: "center",
    },
});
