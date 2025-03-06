import React from "react";
import { Routes, Route } from "react-router-dom";

import PrivateRoute from "./PrivateRoute";
import RouterWrapper from "./RouterWrapper";

import Login from "../pages/Login";
import Clients from "../pages/Clients";
import Client from "../pages/Client";
import Cash from "../pages/Cash";
import Tournament from "../pages/Tournament";
import Acessos from "../pages/Acessos";
import Estoque from "../pages/Estoque";
import Bar from "../pages/Bar";
import Pedido from "../pages/Pedido";
import ViewPedido from "../pages/ViewPedido";
import ViewComanda from "../pages/ViewComanda";
import Tournaments from "../pages/Tournaments";
import CreateTournament from "../pages/CreateTournament";
import ViewTournament from "../pages/ViewTournament";
import PrivateRouteClear from "./PrivateRouteClear";
import Financeiro from "../pages/Financeiro";
import StructureTournament from "../pages/StructureTournament";
import Pedidos from "../pages/Pedidos";
import Relatorios from "../pages/Relatorios";
import Methods from "../pages/Methods";
import Rankings from "../pages/Rankings";
import Ranking from "../pages/Ranking";
import Vagas from "../pages/Vagas";
import GrupoVagas from "../pages/GrupoVagas";

const Router = () => (
  <Routes>
    <Route exact path="/login" element={<RouterWrapper />}>
      <Route exact path="/login" element={<Login />} />
    </Route>
    <Route exact path="/" element={<PrivateRoute />}>
      <Route exact path="/" element={<Clients />} />
    </Route>
    <Route exact path="/clients" element={<PrivateRoute />}>
      <Route exact path="/clients" element={<Clients />} />
    </Route>
    <Route exact path="/cash" element={<PrivateRoute />}>
      <Route exact path="/cash" element={<Cash />} />
    </Route>
    <Route exact path="/bar" element={<PrivateRoute />}>
      <Route exact path="/bar" element={<Bar />} />
    </Route>
    <Route exact path="/bar/pedido" element={<PrivateRoute />}>
      <Route exact path="/bar/pedido" element={<Pedido />} />
    </Route>
    <Route exact path="/bar/comanda/:id" element={<PrivateRoute />}>
      <Route exact path="/bar/comanda/:id" element={<ViewComanda />} />
    </Route>
    <Route exact path="/bar/pedido/:id" element={<PrivateRoute />}>
      <Route exact path="/bar/pedido/:id" element={<ViewPedido />} />
    </Route>
    <Route exact path="/torneio/:tournament_id" element={<PrivateRoute />}>
      <Route exact path="/torneio/:tournament_id" element={<Tournament />} />
    </Route>
    <Route
      exact
      path="/view-torneio/:tournament_id"
      element={<PrivateRouteClear />}
    >
      <Route
        exact
        path="/view-torneio/:tournament_id"
        element={<ViewTournament />}
      />
    </Route>
    <Route exact path="/novo-torneio" element={<PrivateRoute />}>
      <Route exact path="/novo-torneio" element={<CreateTournament />} />
    </Route>
    <Route exact path="/acessos" element={<PrivateRoute />}>
      <Route exact path="/acessos" element={<Acessos />} />
    </Route>
    <Route exact path="/torneios" element={<PrivateRoute />}>
      <Route exact path="/torneios" element={<Tournaments />} />
    </Route>
    <Route exact path="/rankings" element={<PrivateRoute />}>
      <Route exact path="/rankings" element={<Rankings />} />
    </Route>
    <Route exact path="/ranking/:ranking_id" element={<PrivateRoute />}>
      <Route exact path="/ranking/:ranking_id" element={<Ranking />} />
    </Route>
    <Route exact path="/estoque" element={<PrivateRoute />}>
      <Route exact path="/estoque" element={<Estoque />} />
    </Route>
    <Route exact path="/pedidos" element={<PrivateRoute />}>
      <Route exact path="/pedidos" element={<Pedidos />} />
    </Route>
    <Route exact path="/financeiro" element={<PrivateRoute />}>
      <Route exact path="/financeiro" element={<Financeiro />} />
    </Route>
    <Route exact path="/relatorios" element={<PrivateRoute />}>
      <Route exact path="/relatorios" element={<Relatorios />} />
    </Route>
    <Route exact path="/estrutura-torneio/:id" element={<PrivateRoute />}>
      <Route
        exact
        path="/estrutura-torneio/:id"
        element={<StructureTournament />}
      />
    </Route>
    <Route exact path="/vagas" element={<PrivateRoute />}>
      <Route exact path="/vagas" element={<GrupoVagas />} />
    </Route>
    <Route exact path="/vagas/:name" element={<PrivateRoute />}>
      <Route exact path="/vagas/:name" element={<Vagas />} />
    </Route>
    <Route exact path="/metodos-de-pagamento" element={<PrivateRoute />}>
      <Route exact path="/metodos-de-pagamento" element={<Methods />} />
    </Route>
    <Route exact path="/client/:id" element={<PrivateRoute />}>
      <Route exact path="/client/:id" element={<Client />} />
    </Route>
  </Routes>
);

export default Router;
