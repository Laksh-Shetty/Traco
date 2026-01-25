"use client";
import React, { useState, useEffect } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { DeleteIcon, SearchIcon } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { format, set } from "date-fns";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { Button } from "./ui/button";
import { RefreshCcw } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { fa } from "zod/v4/locales";
import { se } from "date-fns/locale";
import { bulkDeleteTransactions } from "@/actions/bulkdelete";
import { toast } from "sonner";

const TransactionComponent = ({ transactions }) => {
  const [sortedTransactions, setSortedTransactions] = useState([]);
  useEffect(() => {
    setSortedTransactions(transactions);
  }, [transactions]);

  const capitalize = (str) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";

  const [show, setShow] = useState(1);
  const pageSize = 20;
  const [currentData, setCurrentData] = useState([]);
  const totalPages = Math.ceil(sortedTransactions.length / pageSize);

  const changePage = (type) => {
    if (type === "next" && show < totalPages) {
      setShow((prev) => prev + 1);
    }

    if (type === "prev" && show > 1) {
      setShow((prev) => prev - 1);
    }
  };

  

  useEffect(() => {
    const start = (show - 1) * pageSize;
    const end = start + pageSize;
    setCurrentData(sortedTransactions.slice(start, end));
  }, [show, sortedTransactions]);

  const colorMap = {
    YEARLY: "bg-purple-100 text-purple-700",
    MONTHLY: "bg-blue-100 text-blue-700",
    WEEKLY: "bg-green-100 text-green-700",
    DAILY: "bg-teal-100 text-teal-700",
  };
  const router = useRouter();

  const [selectedIds, setSelectedIds] = useState([]);

  const handleSelect = (id) => {
    setSelectedIds((curr) => {
      if (curr.includes(id)) {
        setBulkDeleting((prev) => prev - 1);
        if (bulkDeleting - 1 === 0) {
          setFilter(false);
        }
        return curr.filter((item) => item !== id);
      } else {
        setBulkDeleting((prev) => prev + 1);
        setFilter(true);
        return [...curr, id];
      }
    });
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      const allIds = currentData.map((item) => item.id);
      setSelectedIds(allIds);
      setBulkDeleting(allIds.length);
      setFilter(true);
    } else {
      setSelectedIds([]);
      setBulkDeleting(0);
      setFilter(false);
    }
  };

  const [dateasc, setDateAsc] = useState(true);
  const [amountasc, setAmountAsc] = useState(true);
  const [filter, setFilter] = useState(false);

  const handleSort = (key) => {
    let sorted = [...sortedTransactions];

    if (key === "date") {
      sorted.sort((a, b) =>
        dateasc
          ? new Date(a.date) - new Date(b.date)
          : new Date(b.date) - new Date(a.date)
      );
      setDateAsc(!dateasc);
      setAmountAsc(true);
    }

    if (key === "amount") {
      sorted.sort((a, b) =>
        amountasc ? a.amount - b.amount : b.amount - a.amount
      );
      setAmountAsc(!amountasc);
      setDateAsc(true);
    }

    if (key === "category") {
      sorted.sort((a, b) => a.category.localeCompare(b.category));
    }

    setSortedTransactions(sorted);
    setShow(1);
    setFilter(true);
  };

  const onClear = () => {
    setSelectedIds([]);
    setFilter(false);
    setSearch("");
    setDateAsc(true);
    setAmountAsc(true);
    setSortedTransactions(transactions);
    setBulkDeleting(0);
    setShow(1);
  };

  const [bulkDeleting, setBulkDeleting] = useState(0);

  const filterTransactions = (key) => {
    let filtered = [...transactions];

    if (key === "INCOME" || key === "EXPENSE") {
      filtered = filtered.filter((tx) => tx.type === key);
    }
    if (key === "RECURRING") {
      filtered = filtered.filter((tx) => tx.isRecurring);
    }
    if (key === "NON-RECURRING") {
      filtered = filtered.filter((tx) => !tx.isRecurring);
    }
    setFilter(true);

    setSortedTransactions(filtered);
    setShow(1);
  };

  const [search, setSearch] = useState("");

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    let filtered = [...transactions];

    if (search.trim() !== "") {
      const q = search.toLowerCase();

      filtered = filtered.filter(
        (tx) =>
          tx.amount.toString().includes(q) ||
          tx.description.toLowerCase().includes(q) ||
          tx.category.toLowerCase().includes(q) ||
          tx.type.toLowerCase().includes(q)
      );
    }

    setSortedTransactions(filtered);
    setShow(1);
    setFilter(search.trim() !== "");
  }, [search, transactions]);

  const deleteBulk = async (ids) => {
    try {
      await bulkDeleteTransactions(ids);
      router.refresh();
      setSelectedIds([]);
      setBulkDeleting(0);
      setFilter(false);
      toast.success("Transactions deleted successfully.");
    } catch (error) {
      toast.error("Failed to delete transactions:", error);
    }
  };

  return (
    <div>
      <div>
  <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center mb-4 w-[90vw] mx-auto px-4 gap-4">

    
    <InputGroup className="w-full md:w-[52vw]">
      <InputGroupInput
        placeholder="Search..."
        value={search}
        onChange={handleSearch}
      />
      <InputGroupAddon>
        <SearchIcon />
      </InputGroupAddon>
    </InputGroup>

   
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 w-full">

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full">
            All Types ▼
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuItem onClick={() => filterTransactions("INCOME")}>
            Income
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => filterTransactions("EXPENSE")}>
            Expense
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full">
            All Transactions ▼
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuItem onClick={() => filterTransactions("RECURRING")}>
            Recurring Only
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => filterTransactions("NON-RECURRING")}>
            Non-Recurring Only
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {bulkDeleting !== 0 && (
        <Button
          onClick={() => {
            if (
              window.confirm(
                `Are you sure you want to delete ${bulkDeleting} transactions?`
              )
            ) {
              deleteBulk(selectedIds);
            }
          }}
          variant="outline"
          className="bg-red-500 hover:bg-red-600 text-white w-full"
        >
          <DeleteIcon />
          Delete ({bulkDeleting})
        </Button>
      )}

      {filter && (
        <Button
          variant="outline"
          className="text-red-600 hover:bg-red-400 w-full"
          onClick={onClear}
        >
          Clear
        </Button>
      )}
    </div>
  </div>
</div>

      <Table className="w-[90vw] mx-auto border border-gray-200 rounded-lg shadow-md ">
        <TableHeader>
          <TableRow className="font-bold">
            <TableHead className="w-[80px] font-bold text-gray-400">
              <Checkbox
                onCheckedChange={(checked) => handleSelectAll(checked)}
              ></Checkbox>
            </TableHead>
            <TableHead
              className="w-[200px] font-bold text-gray-400 cursor-pointer"
              onClick={() => handleSort("date")}
            >
              Date
              {dateasc ? " ▲" : " ▼"}
            </TableHead>
            <TableHead
              className="font-bold w-[300px] text-gray-400 cursor-pointer"
              onClick={() => handleSort("description")}
            >
              Description
            </TableHead>
            <TableHead
              className="font-bold w-[200px] text-gray-400 cursor-pointer"
              onClick={() => handleSort("category")}
            >
              Category
            </TableHead>
            <TableHead
              className="font-bold text-right text-gray-400 cursor-pointer"
              onClick={() => handleSort("amount")}
            >
              Amount
              {amountasc ? " ▲" : " ▼"}
            </TableHead>
            <TableHead className="font-bold text-gray-400">Recurring</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentData.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell>
                <Checkbox
                  onCheckedChange={() => handleSelect(transaction.id)}
                  checked={selectedIds.includes(transaction.id)}
                />
              </TableCell>
              <TableCell className="font-bold">
                {format(new Date(transaction.date), "PP")}
              </TableCell>
              <TableCell className="font-bold">
                {transaction.description}
              </TableCell>
              <TableCell className="font-bold">
                <Button
                  variant="outline"
                  className="px-2 py-1 rounded-md bg-cyan-400 hover:bg-cyan-500 text-white hover:text-white"
                >
                  {capitalize(transaction.category)}
                </Button>
              </TableCell>
              <TableCell className="text-right font-bold">
                {transaction.type === "EXPENSE" ? (
                  <span className="text-red-500">-₹{transaction.amount}</span>
                ) : (
                  <span className="text-green-500">+₹{transaction.amount}</span>
                )}
              </TableCell>
              <TableCell className="font-bold">
                {transaction.isRecurring ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        className={`${
                          colorMap[transaction.recurringInterval]
                        } px-2 py-1 rounded-md flex items-center gap-1 cursor-pointer `}
                      >
                        <RefreshCcw className="w-4 h-4 " />

                        {capitalize(transaction.recurringInterval)}
                      </Button>
                    </TooltipTrigger>

                    <TooltipContent>
                      <p>
                        {format(new Date(transaction.nextRecurringDate), "PP")}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <Button variant="outline" className="flex gap-1  ">
                    <Clock className="h-4 w-4" />
                    One-time
                  </Button>
                )}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">⋯</Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() =>
                        router.push(
                          `/transaction/create?edit=${transaction.id}`
                        )
                      }
                    >
                      Edit
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() =>
                        deleteBulk([transaction.id])
                      }
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Pagination className="flex justify-center mt-4">
        <PaginationContent>
          <PaginationItem>
            {show > 1 && (
              <PaginationPrevious
                onClick={() => changePage("prev")}
                className="cursor-pointer"
              />
            )}
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">{show}</PaginationLink>
          </PaginationItem>

          <PaginationItem>
            {show < totalPages && (
              <PaginationNext onClick={() => changePage("next")} />
            )}
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default TransactionComponent;
