import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import 'Pantallas/estado_1.dart';
import 'Pantallas/estado_2.dart';

void main() {
  runApp(const SistemaLogin());
}

class SistemaLogin extends StatelessWidget {
  const SistemaLogin({super.key});

  @override
  Widget build(BuildContext context) {

    final GoRouter appRouter = GoRouter(
      routes: [

        GoRoute(
          path: '/',
          builder: (context, state) => const Estado1(),
        ),

        GoRoute(
          path: '/inicio',
          builder: (context, state) => const Estado2(),
        ),
      ],
    );

    return MaterialApp.router(
      debugShowCheckedModeBanner: false,
      routerConfig: appRouter,
      title: "Control de Acceso",
      theme: ThemeData(
        primarySwatch: Colors.teal,
      ),
    );
  }
}
