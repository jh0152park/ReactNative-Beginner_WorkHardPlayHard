import { StatusBar } from "expo-status-bar";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TextInput,
    ScrollView,
} from "react-native";
import { theme } from "./color";
import { useState } from "react";

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

    function addActionItem() {
        if (input === "") {
            return;
        }

        setActionItem(
            Object.assign({}, actionItem, {
                [Date.now()]: { item: input, work: work },
            })
        );
        console.log(actionItem);
        setInput("");
    }

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
                {Object.keys(actionItem).map((key) => (
                    <View key={key} style={styles.actionItem}>
                        <Text style={styles.actionItemText}>
                            {actionItem[key].item}
                        </Text>
                    </View>
                ))}
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
        paddingHorizontal: 40,
        borderRadius: 15,
    },
    actionItemText: {
        color: "whitesmoke",
        fontSize: 20,
        fontWeight: "bold",
    },
});
