import React from "react";
import { ActivityIndicator, StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { HttpLink } from "apollo-link-http";
import { ApolloClient } from "apollo-client";
import { InStorageCache } from "apollo-cache-instorage";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloProvider, Query } from "react-apollo";
import FSStorage from 'redux-persist-fs-storage';
import numeral from "numeral";
import gql from "graphql-tag";

// const cache = new InStorageCache();

const client = new ApolloClient({
  link: new HttpLink({
    uri: `https://48p1r2roz4.sse.codesandbox.io`
  }),
  // cache: new InMemoryCache()
  cache: new InStorageCache({
    storage: FSStorage()
  })
});

const colors = {
  darkBlue: "#2E3B4B",
  white: "#f0f2f5",
  grey: "#dee3e8",
  teal: "#287b97"
};

const fontSize = {
  large: "6em",
  medium: "4em",
  small: "2em"
};



const ExchangeRateQuery = gql`
  query rates($currency: String!) {
    rates(currency: $currency) {
      currency
      rate
    }
  }
`;

export default class App extends React.Component {

  state = {
    currency: "USD"
  };

  onCurrencyChange = currency => this.setState(() => ({ currency }));

  render() {
    const { currency } = this.state, me = this;

    return (
      <ApolloProvider client={client}>
        <View style={styles.container}>
          <Text style={styles.text}>CodeSandb + React Native = AWESOME!</Text>

          <Query query={ExchangeRateQuery} variables={{ currency }}>
            {({ loading, error, data }) => {
console.info('data', data)
              if (loading) return <ActivityIndicator color={colors.teal} />;
              if (error) return <Text>{`Error: ${error}`}</Text>;
              const currentCurrency = currency
              return (
                <View style={styles.container}>
                  {data.rates
                    .filter(
                      ({ currency }) =>
                        currency !== currentCurrency &&
                        ["USD", "BTC", "LTC", "EUR", "JPY", "ETH"].includes(currency)
                    )
                    .map(({ currency, rate }, idx, rateArr) => (
                      <TouchableOpacity
                        accessibilityRole="button"
                        onPress={() => me.onCurrencyChange(currency)}
                        style={[
                          styles.currencyWrapper,
                          idx === rateArr.length - 1 && { borderBottomWidth: 0 }
                        ]}
                        key={currency}
                      >
                        <Text style={styles.text}>{currency}</Text>
                        <Text style={styles.text}>
                          {rate > 1 ? numeral(rate).format("0,0.00") : rate}
                        </Text>
                      </TouchableOpacity>
                    ))}
                </View>
              );
            }}
          </Query>
        </View>
      </ApolloProvider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgb(0, 0, 32)"
  },
  text: {
    color: "#fff",
    fontWeight: "bold"
  },
  // currency: {
  //   fontSize: fontSize.medium,
  //   fontWeight: "100",
  //   color: colors.grey,
  //   letterSpacing: 4
  // }
});
