const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.deleteUser = functions.https.onCall(async (data, context) => {
  // 1. Verificar que el que llama esté autenticado
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "El usuario no está autenticado."
    );
  }

  // 2. Verificar que el que llama sea admin
  const uidSolicitante = context.auth.uid;

  try {
    const docSolicitante = await admin
      .firestore()
      .collection("usuarios")
      .doc(uidSolicitante)
      .get();

    const rolSolicitante = docSolicitante.data()?.rol;

    if (rolSolicitante !== "admin") {
      throw new functions.https.HttpsError(
        "permission-denied",
        "No tienes permisos para eliminar usuarios."
      );
    }
  } catch (error) {
    console.error("Error verificando rol del solicitante:", error);
    throw new functions.https.HttpsError(
      "internal",
      "Error verificando permisos del usuario que intenta eliminar."
    );
  }

  // 3. SOLO usamos docId (id del documento en Firestore)
  const docId = data.docId;

  if (!docId) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "docId no proporcionado."
    );
  }

  try {
    // 4. Eliminar el documento de la colección usuarios
    await admin.firestore().collection("usuarios").doc(docId).delete();

    return { success: true };
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    throw new functions.https.HttpsError(
      "internal",
      "Error al eliminar usuario: " + error.message
    );
  }
});
