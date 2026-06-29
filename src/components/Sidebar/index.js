import React, { useMemo } from "react";
import {
  MdTrolley,
  MdAttachMoney,
  MdStore,
  MdGroups,
  MdAccountBalance,
  MdClose,
  MdLock,
  MdPayments,
  MdBeachAccess,
  MdAccessAlarm,
  MdStar,
} from "react-icons/md";

import { IoMdPodium, IoMdTrophy } from "react-icons/io";

import { FaChartBar } from "react-icons/fa";

import { Link } from "react-router-dom";
import { Container, Logo, Menu, Close } from "./styles";
import logo from "../../assets/logo.png";
import { useAuth } from "../../hooks/AuthContext";
import { toast } from "react-toastify";

function Sidebar({ isMenuMinimized, onChange }) {
  const { user } = useAuth();

  const isAdmin = useMemo(() => user.type === "admin");

  const isBar = useMemo(() => user.type === "bar");

  const isCaixa = useMemo(() => user.type === "caixa");

  return (
    <Container isMenuMinimized={isMenuMinimized}>
      <Close
        onClick={() => {
          onChange();
        }}
      >
        <MdClose color="#001B22" />
      </Close>
      <Link
        onClick={() => {
          onChange(false);
        }}
        to="/"
      >
        <Logo isMenuMinimized={isMenuMinimized}>
          <img src={logo} alt="" />
        </Logo>
      </Link>
      <Menu isMenuMinimized={isMenuMinimized}>
        <li>
          <Link
            onClick={() => {
              onChange(false);
            }}
            to="/clients"
          >
            <MdGroups size={22} color="#fff" />
            <span>Clientes</span>
          </Link>
        </li>
        {(isAdmin || isCaixa) && (
          <li>
            <Link
              onClick={() => {
                if (user.club.access_cash) {
                  onChange(false);
                } else {
                  toast.error("Acesso negado, plano incompatível");
                }
              }}
              to={user.club.access_cash ? "/cash" : ""}
            >
              <MdAttachMoney size={22} color="#fff" />
              <span>Cash</span>
            </Link>
          </li>
        )}
        {(isAdmin || isCaixa) && (
          <>
            <li>
              <Link
                onClick={() => {
                  onChange(false);
                }}
                to="/caixa"
              >
                <MdAccountBalance size={22} color="#fff" />
                <span>Caixa Atual</span>
              </Link>
            </li>
            <li>
              <Link
                onClick={() => {
                  onChange(false);
                }}
                to="/caixas"
              >
                <MdAccountBalance size={22} color="#fff" />
                <span>
                  {user.type == "admin" ? "Caixas do Clube" : "Meus Caixas"}
                </span>
              </Link>
            </li>
          </>
        )}
        {isAdmin && (
          <li>
            <Link
              onClick={() => {
                if (user.club.access_tournament) {
                  onChange(false);
                } else {
                  toast.error("Acesso negado, plano incompatível");
                }
              }}
              to={user.club.access_tournament ? "/torneios" : ""}
            >
              <IoMdTrophy size={22} color="#fff" />
              <span>Torneios</span>
            </Link>
          </li>
        )}
        {isAdmin && (
          <li>
            <Link
              onClick={() => {
                if (user.club.access_tournament) {
                  onChange(false);
                } else {
                  toast.error("Acesso negado, plano incompatível");
                }
              }}
              to={user.club.access_tournament ? "/vagas" : ""}
            >
              <MdStar size={22} color="#fff" />
              <span>Vagas</span>
            </Link>
          </li>
        )}
        {isAdmin && (
          <li>
            <Link
              onClick={() => {
                if (user.club.access_tournament) {
                  onChange(false);
                } else {
                  toast.error("Acesso negado, plano incompatível");
                }
              }}
              to={user.club.access_tournament ? "/rankings" : ""}
            >
              <IoMdPodium size={22} color="#fff" />
              <span>Ranking</span>
            </Link>
          </li>
        )}
        {(isAdmin || isBar) && (
          <li>
            <Link
              onClick={() => {
                if (user.club.access_order) {
                  onChange(false);
                } else {
                  toast.error("Acesso negado, plano incompatível");
                }
              }}
              to={user.club.access_order ? "/bar" : ""}
            >
              <MdStore size={22} color="#fff" />
              <span>Bar</span>
            </Link>
          </li>
        )}
        {(isAdmin || isBar) && (
          <li>
            <Link
              onClick={() => {
                if (user.club.access_stock) {
                  onChange(false);
                } else {
                  toast.error("Acesso negado, plano incompatível");
                }
              }}
              to={user.club.access_stock ? "/estoque" : ""}
            >
              <MdTrolley size={22} color="#fff" />
              <span>Estoque</span>
            </Link>
          </li>
        )}
        {isAdmin && (
          <li>
            <Link
              onClick={() => {
                onChange(false);
              }}
              to="/financeiro"
            >
              <MdAccountBalance size={22} color="#fff" />
              <span>Financeiro</span>
            </Link>
          </li>
        )}
        {isAdmin && (
          <li>
            <Link
              onClick={() => {
                if (user.club.access_users) {
                  onChange(false);
                } else {
                  toast.error("Acesso negado, plano incompatível");
                }
              }}
              to={user.club.access_users ? "/acessos" : ""}
            >
              <MdLock size={22} color="#fff" />
              <span>Acessos</span>
            </Link>
          </li>
        )}
        {isAdmin && (
          <li>
            <Link
              onClick={() => {
                if (user.club.access_report) {
                  onChange(false);
                } else {
                  toast.error("Acesso negado, plano incompatível");
                }
              }}
              to={user.club.access_report ? "/relatorios" : ""}
            >
              <FaChartBar size={22} color="#fff" />
              <span>Relátorios</span>
            </Link>
          </li>
        )}
        {isAdmin && (
          <li>
            <Link
              onClick={() => {
                onChange(false);
              }}
              to="/metodos-de-pagamento"
            >
              <MdPayments size={22} color="#fff" />
              <span>Métodos de Pagamento</span>
            </Link>
          </li>
        )}
      </Menu>
    </Container>
  );
}

export default Sidebar;
