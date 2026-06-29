import React from "react";

import { Container, Method } from "./styles";
import { MdAddCircle, MdAttachMoney, MdDelete } from "react-icons/md";
import { DatePicker, Select, Input } from "antd";
import { ViewInput } from "../../pages/Methods/styles";
import IntlCurrencyInput from "react-intl-currency-input";
import { getValue } from "../../services/functions";
import "moment/locale/zh-cn";
import locale from "antd/es/date-picker/locale/pt_BR";
import dayjs from "dayjs";

const currencyConfig = {
  locale: "pt-BR",
  formats: {
    number: {
      BRL: {
        style: "currency",
        currency: "BRL",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      },
    },
  },
};

import weekday from "dayjs/plugin/weekday";
import localeData from "dayjs/plugin/localeData";

const { TextArea } = Input;

dayjs.extend(weekday);
dayjs.extend(localeData);

const MethodsPayment = ({
  disableCredit,
  getMethods,
  debt,
  receive,
  observation,
  onObservation,
  onDate,
  datePayment,
  operation,
  methodsPayment,
  onValue,
  onType,
  addMethod,
  removeMethod,
  value,
}) => {
  let valueMethods = methodsPayment.filter((item) => item.id != "Crédito")
    .length
    ? methodsPayment
        .filter((item) => item.id != "Crédito")
        .map((method) => method["value"])
        .reduce((total, value) => total + value)
    : 0;

  return (
    <Container>
      {!!(receive && operation == "entrada") && (
        <h4 style={{ width: "100%", color: "#1eb019" }}>
          Esse cliente tem {getValue(receive)} à receber{" "}
        </h4>
      )}
      {!!(debt && operation == "saida") && (
        <h4 style={{ width: "100%", color: "#d63211" }}>
          Esse cliente tem {getValue(debt)} em dívidas pendentes{" "}
        </h4>
      )}
      <h3 style={{ width: "100%" }}>
        Resta ({getValue(value - valueMethods)})
      </h3>
      {methodsPayment.map((item, index) => {
        if (item.id != "Crédito") {
          return (
            <Method>
              <ViewInput style={{ width: "170px" }}>
                <p>Método*</p>
                <Select
                  placeholder={"selecione o método de pagamento"}
                  value={item.id || null}
                  style={{ width: "170px", fontSize: 14, textAlign: "left" }}
                  onChange={(text, type) => {
                    if (type.id == "Pag Dívida" || type.id == "Saldo") {
                      type.value = 0;
                    } else {
                      type.value = methodsPayment[index].value;
                    }
                    onType(index, type);
                  }}
                  options={
                    operation == "entrada"
                      ? receive
                        ? [
                            {
                              id: "Saldo",
                              name: "Saldo",
                              label: "Saldo",
                              percentage: 0,
                              value: "Saldo",
                            },
                            ...getMethods,
                          ]
                        : getMethods
                      : debt
                      ? [
                          {
                            id: "Pag Dívida",
                            name: "Pagamento de Dívida",
                            label: "Pagamento de Dívida",
                            percentage: 0,
                            value: "Pagamento de Dívida",
                          },
                          ...getMethods,
                        ]
                      : getMethods
                  }
                />
              </ViewInput>
              {operation == "entrada" && (
                <ViewInput style={{ marginLeft: 15, width: 65 }}>
                  <p>Porcen*</p>
                  <h4 style={{ height: 20, marginTop: 5 }}>
                    {((item.value / value || 0) * 100).toFixed(2)}%
                  </h4>
                </ViewInput>
              )}
              <ViewInput style={{ marginLeft: 15, flex: 1 }}>
                <p>Valor*</p>
                <IntlCurrencyInput
                  style={{
                    width: "100%",
                    backgroundColor: "#FFF",
                    borderWidth: 0,
                    color: "#001B22",
                    padding: "4px 8px",
                    fontSize: 14,
                    height: 30,
                    borderWidth: 1,
                    borderColor: "#ccc",
                    borderStyle: "solid",
                    borderRadius: 2,
                    fontWeight: "400",
                    paddingLeft: 12,
                  }}
                  currency="BRL"
                  config={currencyConfig}
                  value={item.value}
                  max={
                    item.id == "Pag Dívida"
                      ? value > debt
                      : item.id == "Saldo"
                      ? value > receive
                        ? value
                        : debt
                      : value
                  }
                  onChange={(event, inputValue) => {
                    onValue(index, inputValue);
                  }}
                />
              </ViewInput>
              <MdDelete
                style={{ paddingTop: 9, marginLeft: 5 }}
                size={30}
                onClick={() => {
                  removeMethod(index);
                }}
              />
              {value - valueMethods != 0 && (
                <MdAttachMoney
                  style={{ paddingTop: 9, marginLeft: 5 }}
                  size={30}
                  onClick={() => {
                    if (methodsPayment.lenght == 0) {
                      if (item.id == "Pag Dívida") {
                        onValue(index, value >= debt ? debt : value);
                      } else {
                        if (item.id == "Saldo") {
                          onValue(index, value >= receive ? receive : value);
                        } else {
                          onValue(index, value);
                        }
                      }
                    } else {
                      if (item.id == "Pag Dívida") {
                        onValue(
                          index,
                          value - valueMethods + item.value >= debt
                            ? debt
                            : value - valueMethods + item.value
                        );
                      } else {
                        if (item.id == "Saldo") {
                          onValue(
                            index,
                            value - valueMethods + item.value >= receive
                              ? receive
                              : value - valueMethods + item.value
                          );
                        } else {
                          onValue(index, value - valueMethods + item.value);
                        }
                      }
                    }
                  }}
                />
              )}
            </Method>
          );
        }
      })}

      <MdAddCircle
        size={30}
        onClick={() => {
          addMethod();
        }}
      />
      {value - valueMethods > 0 && !disableCredit && (
        <ViewInput>
          <p>Previsão de Pagamento*</p>
          <DatePicker
            placeholder="data de pagamento"
            format={"DD/MM/YYYY"}
            locale={locale}
            minDate={dayjs(new Date())}
            value={datePayment ? dayjs(datePayment) : ""}
            style={{
              minWidth: "100%",
              height: 35,
              display: "flex",
              alignItems: "center",
              borderRadius: 2,
            }}
            onChange={(date) => onDate(date)}
          />
        </ViewInput>
      )}

      <ViewInput>
        <p>Observação</p>
        <TextArea
          placeholder="deixe uma observação"
          value={observation}
          autoSize={{ maxRows: 4 }}
          style={{
            width: "100%",
            backgroundColor: "#FFF",
            borderWidth: 0,
            color: "#001B22",
            padding: "8px",
            height: 35,
            fontSize: 14,
            borderWidth: 1,
            borderColor: "#ccc",
            borderStyle: "solid",
            borderRadius: 2,
            fontWeight: "400",
            paddingLeft: 12,
          }}
          onChange={(text) => onObservation(text.target.value)}
        />
      </ViewInput>
    </Container>
  );
};

export default MethodsPayment;
