"use client";
import { getProduct, getColumn } from "@/actions/Products";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Select,
  SelectItem,
  Input,
} from "@nextui-org/react";
import {
  Pagination,
  PaginationItem,
  PaginationCursor,
} from "@nextui-org/pagination";
import { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/table";
import { Button } from "@nextui-org/button";
import { ChevronDownIcon, SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useConfigurationStore } from "@/utils/store";

type Column = {
  key: string;
  Label: string;
};

export default function Page() {
  const [products, setProducts] = useState<any[]>([]);
  const [columns, setColumns] = useState<Column[]>([]);
  const [selectedColumns, setSelectedColumns] = useState<Column[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchAttribute, setSearchAttribute] = useState<string>("");
  const [searchValue, setSearchValue] = useState<string>("");
  const [endPage, setEndPage] = useState(1);
  const [previousSearchValue, setPreviousSearchValue] = useState("");
  const [previousSearchAttribute, setPreviousSearchAttribute] = useState("");
  const configuration = useConfigurationStore((state) => state.configuration);
  const router = useRouter();
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setProducts([]);
      let filter = {};
      if (previousSearchAttribute && previousSearchValue) {
        filter = { [previousSearchAttribute]: previousSearchValue };
        setCurrentPage(1);
      }
      const { data, totalRows } = await getProduct(configuration, {
        startRow: currentPage * 10 - 10,
        endRow: currentPage * 10,
        filterData: filter,
      });
      setProducts(data);
      setEndPage(Math.ceil(totalRows / 10));
    };

    const fetchColumns = async () => {
      const data = await getColumn(configuration);
      setColumns(data);
      setSelectedColumns(data);
    };
    setFetching(true);

    fetchColumns();
    fetchProducts();
    setFetching(false);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setProducts([]);
      let filter = {};
      if (previousSearchAttribute && previousSearchValue) {
        filter = { [previousSearchAttribute]: previousSearchValue };
        setCurrentPage(1);
      }
      const { data, totalRows } = await getProduct(configuration, {
        startRow: currentPage * 10 - 10,
        endRow: currentPage * 10,
        filterData: filter,
      });
      setProducts(data);
      setEndPage(Math.ceil(totalRows / 10));
    };

    const fetchColumns = async () => {
      const data = await getColumn(configuration);
      setColumns(data);
      setSelectedColumns(data);
    };
    setFetching(true);

    fetchColumns();
    fetchProducts();
    setFetching(false);
  }, [currentPage]);

  const handleSelectionChange = (keys: any) => {
    const selected = columns.filter((column) => keys.has(column.key));
    setSelectedColumns(selected);
  };

  const search = async () => {
    const filter =
      searchAttribute === "All" ? {} : { [searchAttribute]: searchValue };
    if (searchAttribute === "All") {
      setPreviousSearchAttribute("");
      setPreviousSearchValue("");
    } else {
      setPreviousSearchAttribute(searchAttribute);
      setPreviousSearchValue(searchValue);
    }
    setCurrentPage(1);
    setFetching(true);

    setProducts([]);
    const { data, totalRows } = await getProduct(configuration, {
      startRow: currentPage * 10 - 10,
      endRow: currentPage * 10,
      filterData: filter,
    });

    setProducts(data);
    setEndPage(Math.ceil(totalRows / 10));
    setFetching(false);
  };

  useEffect(() => {
    if (!configuration) {
      console.log(configuration);
      router.push("/");
    }
  }, [configuration]);


  return (
    <div className="w-screen h-screen flex flex-col gap-4 justify-center items-center">
      <div className="flex gap-8 mt-2">
        <img
          src="/LAVENDEL-CONSULTING.png"
          className="w-36 h-20 mt-4"
          alt="Logo"
        />
        <h1 className="text-6xl mt-8">Lavendel Consulting Products</h1>
      </div>
      <div className="flex w-[990px] justify-between">
        <div className="flex w-full gap-4">
          <Input
            isClearable
            className="w-full sm:max-w-[24%] text-black"
            placeholder="Search by"
            startContent={<SearchIcon />}
            value={searchValue}
            onClear={() => setSearchValue("")}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <Select
            className="w-[185px] text-black rounded-lg"
            placeholder="Search Attribute"
            onSelectionChange={(e: any) => setSearchAttribute(e.currentKey)}
          >
            {[{ key: "All", Label: "All" }, ...columns].map((column) => (
              <SelectItem
                key={column.key}
                value={column.key}
                className="text-black"
              >
                {column.Label}
              </SelectItem>
            ))}
          </Select>
          <Button
            className="text-white font-semibold bg-blue-500"
            onClick={search}
          >
            Enter
          </Button>
        </div>
        <Dropdown className="text-black">
          <DropdownTrigger>
            <Button
              endContent={<ChevronDownIcon className="text-small" />}
              variant="flat"
              className="w-[185px] bg-white"
            >
              Visible Columns
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            closeOnSelect={false}
            selectedKeys={new Set(selectedColumns.map((col) => col.key))}
            selectionMode="multiple"
            onSelectionChange={handleSelectionChange}
            className="h-[300px] overflow-y-auto no-scrollbar"
          >
            {columns.map((column) => (
              <DropdownItem key={column.key} value={column.key}>
                {column.Label}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
      </div>

      <div className="w-[1000px]">
        {products.length > 0 && selectedColumns.length > 0 ? (
          <Table className="text-black w-full h-[400px]">
            <TableHeader columns={selectedColumns}>
              {(column) => (
                <TableColumn key={column.key}>{column.Label}</TableColumn>
              )}
            </TableHeader>
            <TableBody items={products}>
              {(item) => (
                <TableRow key={item.typedId}>
                  {selectedColumns.map((column) => (
                    <TableCell key={column.key}>
                      {item[column.key] ? item[column.key] : "null"}
                    </TableCell>
                  ))}
                </TableRow>
              )}
            </TableBody>
          </Table>
        ) : (
          <div className="flex justify-center h-[400px] items-center text-2xl">
            {fetching ? "Loading..." : "No data found"}
          </div>
        )}
      </div>
      <Pagination
        initialPage={1}
        total={endPage}
        onChange={(page) => setCurrentPage(page)}
        className="mt-5"
      />
    </div>
  );
}
