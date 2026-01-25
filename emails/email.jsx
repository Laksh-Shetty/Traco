import * as React from "react";
import {
  Html,
  Head,
  Body,
  Preview,
  Container,
  Heading,
  Text,
  Section,
  Row,
  Column,
} from "@react-email/components";

export default function Email({
  username = "",
  type = "",
  data = {},
})  {
  if (type === "monthly-report") {
  const { stats, month, insights } = data;

  return (
    <Html>
      <Head />
      <Preview>Your Monthly Financial Report – {month}</Preview>

      <Body style={styles.body}>
        <Container style={styles.container}>
          <Heading style={styles.heading}>
            Monthly Financial Report
          </Heading>

          <Text>
            Hi <strong>{username}</strong>, here’s your financial summary for{" "}
            <strong>{month}</strong>.
          </Text>

          {/* Summary */}
          <Section style={styles.stats}>
            <Row>
              <Column>
                <Text style={styles.label}>Total Income</Text>
                <Text style={styles.value}>₹{stats.totalIncome.toFixed(2)}</Text>
              </Column>

              <Column>
                <Text style={styles.label}>Total Expenses</Text>
                <Text style={styles.value}>₹{stats.totalExpense.toFixed(2)}</Text>
              </Column>

              <Column>
                <Text style={styles.label}>Transactions</Text>
                <Text style={styles.value}>{stats.transactionCount}</Text>
              </Column>
            </Row>
          </Section>

          {/* Category Breakdown */}
          {stats.byCategory && Object.keys(stats.byCategory).length > 0 && (
            <Section style={{ marginTop: "20px" }}>
              <Heading as="h3" style={{ fontSize: "16px" }}>
                Spending by Category
              </Heading>

              {Object.entries(stats.byCategory).map(
                ([category, amount]) => (
                  <Text key={category}>
                    {category}: ₹{amount.toFixed(0)}
                  </Text>
                )
              )}
            </Section>
          )}

          {/* Insights */}
          {insights?.length > 0 && (
            <Section style={{ marginTop: "20px" }}>
              <Heading as="h3" style={{ fontSize: "16px" }}>
                Key Insights
              </Heading>

              {insights.map((insight, idx) => (
                <Text key={idx}>• {insight}</Text>
              ))}
            </Section>
          )}

          <Section style={{ marginTop: "24px" }}>
            <Text style={{ fontSize: "14px", color: "#6b7280" }}>
              Keep tracking your expenses to receive better insights every
              month.
            </Text>

            <Text style={{ fontSize: "14px" }}>
              — Your Finance App Team
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}


  if (type === "budget-alert") {
    username= data.username?? "";
    const percentageUsed = Number(data?.percentageUsed ?? 0);
    const budgetAmount = Number(data?.budgetAmount ?? 0);
    const totalExpense = Number(data?.totalExpense ?? 0);
    const remaining = (budgetAmount - totalExpense).toFixed(2);

    return (
      <Html>
        <Head />
        <Preview>⚠️ Budget Alert</Preview>

        <Body style={styles.body}>
          <Container style={styles.container}>
            <Heading style={styles.heading}>
              Budget Alert
            </Heading>

            <Text>Hello {username},</Text>

            <Text>
              You have used <strong>{percentageUsed.toFixed(2)}%</strong> of your
              monthly budget.
            </Text>

            <Section style={styles.stats}>
              <Row>
                <Column>
                  <Text style={styles.label}>Budget Amount</Text>
                  <Text style={styles.value}>₹{budgetAmount}</Text>
                </Column>

                <Column>
                  <Text style={styles.label}>Spent So Far</Text>
                  <Text style={styles.value}>₹{totalExpense}</Text>
                </Column>

                <Column>
                  <Text style={styles.label}>Remaining</Text>
                  <Text style={styles.value}>₹{remaining}</Text>
                </Column>
              </Row>
            </Section>
          </Container>
        </Body>
      </Html>
    );
  }

  return null;
}

const styles = {
  body: {
    backgroundColor: "#f6f9fc",
    fontFamily: "Arial, sans-serif",
  },
  container: {
    backgroundColor: "#ffffff",
    padding: "24px",
    borderRadius: "8px",
  },
  heading: {
    marginBottom: "12px",
  },
  stats: {
    marginTop: "20px",
  },
  label: {
    fontSize: "12px",
    color: "#6b7280",
  },
  value: {
    fontSize: "14px",
    fontWeight: "bold",
  },
};
