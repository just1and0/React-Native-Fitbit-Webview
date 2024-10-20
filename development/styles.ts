import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        padding: 20,
        borderRadius: 10,
        flex: 1
    },
    modalFooter: {
        height: 70,
        justifyContent: 'center',
        alignItems: 'center'
    }
});