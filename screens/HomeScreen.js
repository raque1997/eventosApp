import { StyleSheet, Text, View, Button, FlatList, TouchableOpacity, Modal, TextInput, Alert } from "react-native";
import React, { useState } from "react";
import { Share } from "react-native";

const eventosEjemplo = [
  { id: "1", nombre: "Evento Futuro", fecha: "2025-06-10", pasado: false },
  { id: "2", nombre: "Evento Pasado", fecha: "2025-05-01", pasado: true },
];

export default function HomeScreen() {
  const [eventos, setEventos] = useState(eventosEjemplo);
  const [modalVisible, setModalVisible] = useState(false);
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [nuevaFecha, setNuevaFecha] = useState("");
  const [rsvpEventos, setRsvpEventos] = useState([]); // IDs de eventos con RSVP

  // Comentarios y calificaciones
  const [comentarios, setComentarios] = useState([]); // [{eventoId, texto, calificacion}]
  const [comentarioModalVisible, setComentarioModalVisible] = useState(false);
  const [comentarioEventoId, setComentarioEventoId] = useState(null);
  const [comentarioTexto, setComentarioTexto] = useState("");
  const [calificacion, setCalificacion] = useState("");

  // Estadísticas
  const totalEventos = eventos.length;
  const totalProximos = eventos.filter(e => !e.pasado).length;
  const totalPasados = eventos.filter(e => e.pasado).length;
  const totalConfirmados = rsvpEventos.length;
  const totalAsistidos = eventos.filter(e => e.pasado && rsvpEventos.includes(e.id)).length;

  const handleRSVP = (eventoId) => {
    if (rsvpEventos.includes(eventoId)) {
      Alert.alert("Ya confirmado", "Ya has confirmado tu asistencia a este evento.");
      return;
    }
    setRsvpEventos([...rsvpEventos, eventoId]);
    Alert.alert("¡Confirmado!", "Has confirmado tu asistencia. Recibirás notificaciones de cambios o recordatorios.");
  };

  const handleCompartir = async (evento) => {
    const mensaje = `¡Te invito al evento "${evento.nombre}" el día ${evento.fecha}!`;
    try {
      await Share.share({
        message: mensaje,
      });
    } catch (error) {
      Alert.alert('Error', 'No se pudo compartir el evento.');
    }
  };

  // Comentarios y calificaciones
  const abrirComentario = (eventoId) => {
    setComentarioEventoId(eventoId);
    setComentarioTexto("");
    setCalificacion("");
    setComentarioModalVisible(true);
  };

  const guardarComentario = () => {
    if (!comentarioTexto || !calificacion) {
      Alert.alert("Error", "Completa comentario y calificación");
      return;
    }
    setComentarios([...comentarios, {
      eventoId: comentarioEventoId,
      texto: comentarioTexto,
      calificacion,
    }]);
    setComentarioModalVisible(false);
  };

  // Permitir comentar si el evento es pasado Y el usuario hizo RSVP
  const puedeComentar = (item) => {
    return item.pasado && rsvpEventos.includes(item.id);
  };

  const renderEvento = ({ item }) => (
    <View style={styles.evento}>
      <Text style={styles.nombre}>{item.nombre} ({item.fecha})</Text>
      <View style={styles.botonesFila}>
        <Button
          title={rsvpEventos.includes(item.id) ? "Confirmado" : "RSVP"}
          onPress={() => handleRSVP(item.id)}
          color={rsvpEventos.includes(item.id) ? "#4CAF50" : undefined}
        />
        <Button
          title="Comentar"
          onPress={() => puedeComentar(item) && abrirComentario(item.id)}
          disabled={!puedeComentar(item)}
          color={puedeComentar(item) ? "#2196F3" : "#BDBDBD"}
        />
        <Button title="Compartir" onPress={() => handleCompartir(item)} />
      </View>
    </View>
  );

  const crearEvento = () => {
    if (!nuevoNombre || !nuevaFecha) {
      Alert.alert("Error", "Completa todos los campos");
      return;
    }

    // Validar formato de fecha YYYY-MM-DD
    const regexFecha = /^\d{4}-\d{2}-\d{2}$/;
    if (!regexFecha.test(nuevaFecha)) {
      Alert.alert("Error", "Formato de fecha inválido. Usa YYYY-MM-DD.");
      return;
    }

    // Crear objeto de fecha y normalizar
    const fechaEvento = new Date(nuevaFecha + "T00:00:00");
    if (isNaN(fechaEvento)) {
      Alert.alert("Error", "Fecha inválida.");
      return;
    }

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    fechaEvento.setHours(0, 0, 0, 0);

    const nuevoEvento = {
      id: (eventos.length + 1).toString(),
      nombre: nuevoNombre,
      fecha: nuevaFecha,
      pasado: fechaEvento < hoy,
    };

    setEventos([...eventos, nuevoEvento]);
    setModalVisible(false);
    setNuevoNombre("");
    setNuevaFecha("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>📅 Lista de eventos</Text>

      {/* Estadísticas */}
      <View style={styles.statsBox}>
        <Text>Eventos totales: {totalEventos}</Text>
        <Text>Próximos: {totalProximos}</Text>
        <Text>Pasados: {totalPasados}</Text>
        <Text>Confirmados (RSVP): {totalConfirmados}</Text>
        <Text>Asistidos (historial): {totalAsistidos}</Text>
      </View>

      <Text style={styles.subtitulo}>Próximos</Text>
      <FlatList
        data={eventos.filter(e => !e.pasado)}
        renderItem={renderEvento}
        keyExtractor={item => item.id}
      />

      <Text style={styles.subtitulo}>Pasados</Text>
      <FlatList
        data={eventos.filter(e => e.pasado)}
        renderItem={renderEvento}
        keyExtractor={item => item.id}
      />

      {/* Historial de asistencia */}
      <Text style={styles.subtitulo}>Historial de asistencia</Text>
      <FlatList
        data={eventos.filter(e => e.pasado && rsvpEventos.includes(e.id))}
        renderItem={({ item }) => {
          const comentario = comentarios.find(c => c.eventoId === item.id);
          return (
            <View style={styles.evento}>
              <Text style={styles.nombre}>{item.nombre} ({item.fecha})</Text>
              <Text style={{ color: "#4CAF50" }}>Asististe ✅</Text>
              {comentario && (
                <View style={{ marginTop: 5 }}>
                  <Text>Comentario: {comentario.texto}</Text>
                  <Text>Calificación: {comentario.calificacion} ⭐</Text>
                </View>
              )}
            </View>
          );
        }}
        keyExtractor={item => item.id}
        ListEmptyComponent={<Text style={{ color: "#888" }}>No hay eventos asistidos.</Text>}
      />

      <TouchableOpacity style={styles.botonCrear} onPress={() => setModalVisible(true)}>
        <Text style={styles.textoBoton}>➕ Crear evento</Text>
      </TouchableOpacity>

      {/* Modal para crear evento */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalFondo}>
          <View style={styles.modalContenido}>
            <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>Nuevo Evento</Text>
            <TextInput
              placeholder="Nombre del evento"
              value={nuevoNombre}
              onChangeText={setNuevoNombre}
              style={styles.input}
            />
            <TextInput
              placeholder="Fecha (YYYY-MM-DD)"
              value={nuevaFecha}
              onChangeText={setNuevaFecha}
              style={styles.input}
            />
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Button title="Cancelar" onPress={() => setModalVisible(false)} />
              <Button title="Crear" onPress={crearEvento} />
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal para comentarios y calificaciones */}
      <Modal visible={comentarioModalVisible} animationType="slide" transparent>
        <View style={styles.modalFondo}>
          <View style={styles.modalContenido}>
            <Text style={{ fontWeight: "bold", fontSize: 16, marginBottom: 10 }}>Deja tu comentario y calificación</Text>
            <TextInput
              placeholder="Comentario"
              value={comentarioTexto}
              onChangeText={setComentarioTexto}
              style={styles.input}
            />
            <TextInput
              placeholder="Calificación (1-10)"
              value={calificacion}
              onChangeText={setCalificacion}
              style={styles.input}
              keyboardType="numeric"
              maxLength={1}
            />
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Button title="Cancelar" onPress={() => setComentarioModalVisible(false)} />
              <Button title="Guardar" onPress={guardarComentario} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  titulo: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  subtitulo: { fontSize: 18, marginTop: 15, marginBottom: 5 },
  statsBox: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: "#e0e7ff",
    borderRadius: 8,
  },
  evento: { backgroundColor: "#f0f0f0", padding: 10, marginBottom: 8, borderRadius: 8 },
  nombre: { fontSize: 16, fontWeight: "bold" },
  botonesFila: { flexDirection: "row", justifyContent: "space-between", marginTop: 5 },
  botonCrear: { backgroundColor: "#2196F3", padding: 15, borderRadius: 8, alignItems: "center", marginTop: 20 },
  textoBoton: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  modalFondo: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContenido: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
});