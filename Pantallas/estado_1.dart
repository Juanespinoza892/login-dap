import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class Estado1 extends StatefulWidget {
  const Estado1({super.key});

  @override
  State<Estado1> createState() => _Estado1State();
}

class _Estado1State extends State<Estado1> {

  final TextEditingController nombreUsuario =
      TextEditingController();

  final TextEditingController claveUsuario =
      TextEditingController();

  String aviso = "";

  void abrirPantallaPrincipal() {

    String usuario = nombreUsuario.text;
    String clave = claveUsuario.text;

    setState(() {

      if (usuario.isEmpty || clave.isEmpty) {

        aviso = "Faltan completar datos";

      } else if (usuario == "usuario" && clave == "2026") {

        aviso = "Acceso permitido";

        Future.delayed(const Duration(seconds: 1), () {

          context.go('/inicio');

        });

      } else {

        aviso = "Datos incorrectos";

      }
    });
  }

  @override
  Widget build(BuildContext context) {

    return Scaffold(

      appBar: AppBar(
        title: const Text("Ingreso al Sistema"),
      ),

      body: Padding(
        padding: const EdgeInsets.all(30),

        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,

          children: [

            TextField(
              controller: nombreUsuario,

              decoration: const InputDecoration(
                labelText: "Nombre de usuario",
                border: OutlineInputBorder(),
              ),
            ),

            const SizedBox(height: 20),

            TextField(
              controller: claveUsuario,
              obscureText: true,

              decoration: const InputDecoration(
                labelText: "Clave de acceso",
                border: OutlineInputBorder(),
              ),
            ),

            const SizedBox(height: 25),

            ElevatedButton(
              onPressed: abrirPantallaPrincipal,
              child: const Text("Acceder"),
            ),

            const SizedBox(height: 20),

            Text(
              aviso,
              style: const TextStyle(
                fontSize: 18,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
