import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class Estado2 extends StatelessWidget {
  const Estado2({super.key});

  void regresarPantallaIngreso(BuildContext context) {

    context.go('/');

  }

  @override
  Widget build(BuildContext context) {

    return Scaffold(

      appBar: AppBar(
        title: const Text("Panel Principal"),
      ),

      body: Center(

        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,

          children: [

            const Text(
              "Sesión iniciada correctamente",
              style: TextStyle(
                fontSize: 24,
              ),
            ),

            const SizedBox(height: 25),

            ElevatedButton(
              onPressed: () {
                regresarPantallaIngreso(context);
              },
              child: const Text("Salir"),
            ),
          ],
        ),
      ),
    );
  }
}
