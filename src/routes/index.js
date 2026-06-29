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
import Banks from "../pages/Banks";
import Payable from "../pages/Payable";
import Caixa from "../pages/Caixa";
import CaixasFechados from "../pages/CaixasFechados";
import ViewTournamentOk from "../pages/ViewTournamentOk";
import ViewTournamentOG from "../pages/ViewTournamentOG";
import ViewTournamentGG from "../pages/ViewTournamentGG";
import ViewTournamentBF from "../pages/ViewTournamentBR";
import ViewTournamentBR from "../pages/ViewTournamentBR";
import ViewTournamentCP from "../pages/ViewTournamentCP";

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
    <Route exact path="/contas" element={<PrivateRoute />}>
      <Route exact path="/contas" element={<Banks />} />
    </Route>
    <Route exact path="/despesas" element={<PrivateRoute />}>
      <Route exact path="/despesas" element={<Payable />} />
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
      path="/view-torneio-blu/:tournament_id"
      element={<PrivateRouteClear />}
    >
      <Route
        exact
        path="/view-torneio-blu/:tournament_id"
        element={<ViewTournament index={0} />}
      />
    </Route>
    <Route
      exact
      path="/view-torneio/:tournament_id"
      element={<PrivateRouteClear />}
    >
      <Route
        exact
        path="/view-torneio/:tournament_id"
        element={<ViewTournamentOk index={0} />}
      />
    </Route>
    <Route
      exact
      path="/view-torneio-og/:tournament_id"
      element={<PrivateRouteClear />}
    >
      <Route
        exact
        path="/view-torneio-og/:tournament_id"
        element={<ViewTournamentOG index={0} />}
      />
    </Route>
    <Route
      exact
      path="/view-torneio-gg/:tournament_id"
      element={<PrivateRouteClear />}
    >
      <Route
        exact
        path="/view-torneio-gg/:tournament_id"
        element={<ViewTournamentGG index={0} />}
      />
    </Route>
    <Route
      exact
      path="/view-torneio-br/:tournament_id"
      element={<PrivateRouteClear />}
    >
      <Route
        exact
        path="/view-torneio-br/:tournament_id"
        element={<ViewTournamentBR index={0} />}
      />
    </Route>
    <Route
      exact
      path="/view-torneio-cp/:tournament_id"
      element={<PrivateRouteClear />}
    >
      <Route
        exact
        path="/view-torneio-cp/:tournament_id"
        element={<ViewTournamentCP index={0} />}
      />
    </Route>
    <Route
      exact
      path="/view-tournament-blu/:tournament_id"
      element={<PrivateRouteClear />}
    >
      <Route
        exact
        path="/view-tournament-blu/:tournament_id"
        element={<ViewTournament index={1} />}
      />
    </Route>
    <Route
      exact
      path="/view-tournament/:tournament_id"
      element={<PrivateRouteClear />}
    >
      <Route
        exact
        path="/view-tournament/:tournament_id"
        element={<ViewTournamentOk index={1} />}
      />
    </Route>
    <Route
      exact
      path="/view-tournament-og/:tournament_id"
      element={<PrivateRouteClear />}
    >
      <Route
        exact
        path="/view-tournament-og/:tournament_id"
        element={<ViewTournamentOG index={1} />}
      />
    </Route>
    <Route
      exact
      path="/view-tournament-gg/:tournament_id"
      element={<PrivateRouteClear />}
    >
      <Route
        exact
        path="/view-tournament-gg/:tournament_id"
        element={<ViewTournamentGG index={1} />}
      />
    </Route>
    <Route
      exact
      path="/view-tournament-br/:tournament_id"
      element={<PrivateRouteClear />}
    >
      <Route
        exact
        path="/view-tournament-br/:tournament_id"
        element={<ViewTournamentBR index={1} />}
      />
    </Route>
    <Route
      exact
      path="/view-tournament-cp/:tournament_id"
      element={<PrivateRouteClear />}
    >
      <Route
        exact
        path="/view-tournament-cp/:tournament_id"
        element={<ViewTournamentCP index={1} />}
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
    <Route exact path="/caixa" element={<PrivateRoute />}>
      <Route exact path="/caixa" element={<Caixa />} />
    </Route>
    <Route exact path="/caixas" element={<PrivateRoute />}>
      <Route exact path="/caixas" element={<CaixasFechados />} />
    </Route>
  </Routes>
);

export default Router;
