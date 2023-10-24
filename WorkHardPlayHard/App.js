import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { theme } from "./color";

export default function App() {
    return (
        <View style={styles.container}>
            <StatusBar style="auto" />
            <View style={styles.header}>
                <TouchableOpacity>
                    <Text style={styles.buttonText}>Work</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Text style={styles.buttonText}>Play</Text>
                </TouchableOpacity>
            </View>
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
        color: "whitesmoke",
        fontSize: 35,
        fontWeight: "bold",
    },
});
