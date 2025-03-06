import React from "react";
import { Container } from "./styles";
import { MdMenu, MdExitToApp } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/AuthContext";

const Header = ({ onChange }) => {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();

  return (
    <Container>
      <button
        style={{ color: "#fff", position: "absolute", left: 20 }}
        onClick={() => {
          onChange();
        }}
      >
        <MdMenu color="#FFF" size={35} />
      </button>
      <div style={{ position: "absolute", right: 0 }}>
        <div>
          <p>{user.name}</p>
          <h3>{user.type}</h3>
        </div>
        <button
          style={{
            marginLeft: 15,
            background: "#FFF",
            borderRadius: "100px",
            height: 40,
            width: 40,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => {
            signOut();
            navigate("/login");
          }}
        >
          <MdExitToApp color="#001B22" size={25} />
        </button>
      </div>
    </Container>
  );
};

export default Header;
