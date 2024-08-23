"use client";

import axios from "axios";

export const getProduct = async (
  configuration: {
    partitionName: string;
    username: string;
    password: string;
    baseURL: string;
  },
  {
    startRow,
    endRow,
    filterData,
  }: {
    startRow: number;
    endRow: number;
    filterData: any;
  }
) => {
  try {
    const { partitionName, username, password, baseURL } = configuration;

    const body = {
      endRow,
      operationType: "fetch",
      startRow,
      resultFields: [],
      textMatchStyle: "substring",
      data: filterData || {},
    };

    const url = `${baseURL}/pricefx/${partitionName}/productmanager.fetchformulafilteredproducts`;

    const resp = await axios.post(url, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(
          `${partitionName}/${username}:${password}`
        ).toString("base64")}`,
      },
    });

    const data = resp.data.response;
    const totalRows = data.totalRows;
    return {
      data: data.data,
      totalRows,
    };
  } catch (e) {
    return {
      data: [],
      totalRows: 0,
    };
  }
};

export const getColumn = async (configuration: {
  partitionName: string;
  username: string;
  password: string;
  baseURL: string;
}) => {
  try {
    const { partitionName, username, password, baseURL } = configuration;
    const body = {
      startRow: 0,
      endRow: 1,
      operationType: "fetch",
    };

    const resp = await axios.post(
      `${baseURL}/pricefx/${partitionName}/productmanager.fetchformulafilteredproducts`,
      body,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${Buffer.from(
            `${partitionName}/${username}:${password}`
          ).toString("base64")}`,
        },
      }
    );

    const data = resp.data.response;
    const columns: any = [];

    data.data.forEach((element: {}) => {
      Object.keys(element).forEach((key) => {
        columns.push({ key: key, Label: key });
      });
    });

    return columns;
  } catch (e) {
    return [];
  }
};
