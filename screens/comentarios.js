import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const StarRating = ({ rating, setRating }) => (
    <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity key={star} onPress={() => setRating(star)}>
                <Text style={star <= rating ? styles.starSelected : styles.starUnselected}>★</Text>
            </TouchableOpacity>
        ))}
    </View>
);

const Comentarios = () => {
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [correo, setCorreo] = useState('');
    const [comentario, setComentario] = useState('');
    const [rating, setRating] = useState(0);

    const handleEnviar = () => {
        // Aquí puedes manejar el envío del comentario
        // Por ejemplo, enviar los datos a un servidor o mostrar un mensaje
        console.log({ nombre, apellido, correo, comentario, rating });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Nombre:</Text>
            <TextInput
                style={styles.input}
                value={nombre}
                onChangeText={setNombre}
                placeholder="Ingresa tu nombre"
            />

            <Text style={styles.label}>Apellido:</Text>
            <TextInput
                style={styles.input}
                value={apellido}
                onChangeText={setApellido}
                placeholder="Ingresa tu apellido"
            />

            <Text style={styles.label}>Correo electrónico:</Text>
            <TextInput
                style={styles.input}
                value={correo}
                onChangeText={setCorreo}
                placeholder="Ingresa tu correo"
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <Text style={styles.label}>Comentario:</Text>
            <TextInput
                style={[styles.input, styles.textArea]}
                value={comentario}
                onChangeText={setComentario}
                placeholder="Escribe tu comentario"
                multiline
                numberOfLines={4}
            />

            <Text style={styles.label}>Calificación:</Text>
            <StarRating rating={rating} setRating={setRating} />

            <TouchableOpacity style={styles.button} onPress={handleEnviar}>
                <Text style={styles.buttonText}>Enviar</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 24,
        backgroundColor: '#fff',
        flex: 1,
    },
    label: {
        marginTop: 12,
        marginBottom: 4,
        fontWeight: 'bold',
        fontSize: 16,
    },
    input: {
        borderWidth: 1,
        borderColor: '#bbb',
        borderRadius: 6,
        padding: 10,
        fontSize: 16,
        backgroundColor: '#f9f9f9',
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    starsContainer: {
        flexDirection: 'row',
        marginVertical: 8,
    },
    starSelected: {
        fontSize: 32,
        color: '#FFD700',
        marginHorizontal: 2,
    },
    starUnselected: {
        fontSize: 32,
        color: '#ccc',
        marginHorizontal: 2,
    },
    button: {
        backgroundColor: '#007bff',
        padding: 14,
        borderRadius: 6,
        alignItems: 'center',
        marginTop: 24,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18,
    },
});

export default Comentarios;