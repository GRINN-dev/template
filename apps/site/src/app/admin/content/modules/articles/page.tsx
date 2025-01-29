import { graphql } from "@grinn/graphql";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { query } from "@/graphql/server";
import { CreateArticleForm } from "./_components/create-article-form";

export default async function Page() {
  const { data } = await query({ query: articlesQuery });
  return (
    <div>
      <h1>Articles</h1>
      <Sheet>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Créer un article</SheetTitle>
          </SheetHeader>
          <CreateArticleForm />
        </SheetContent>
        <SheetTrigger>Créer un article</SheetTrigger>
      </Sheet>

      {/* liste des articles dans une table */}

      <Table>
        <TableCaption>A list of your recent articles.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Article</TableHead>
            <TableHead>Content</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.articles?.nodes.map((content) => {
            return content ? (
              <TableRow key={content.id}>
                <TableCell className="font-medium">{content.id}</TableCell>
              </TableRow>
            ) : null;
          })}
        </TableBody>
      </Table>
    </div>
  );
}

const articlesQuery = graphql(`
  query Contents {
    articles {
      totalCount
      nodes {
        id
        type
        body
      }
    }
  }
`);

/* 


const invoices = [
  {
    invoice: "INV001",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV002",
    paymentStatus: "Pending",
    totalAmount: "$150.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV003",
    paymentStatus: "Unpaid",
    totalAmount: "$350.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV004",
    paymentStatus: "Paid",
    totalAmount: "$450.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV005",
    paymentStatus: "Paid",
    totalAmount: "$550.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV006",
    paymentStatus: "Pending",
    totalAmount: "$200.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV007",
    paymentStatus: "Unpaid",
    totalAmount: "$300.00",
    paymentMethod: "Credit Card",
  },
]

export function TableDemo() {
  return (
    <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Method</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow key={invoice.invoice}>
            <TableCell className="font-medium">{invoice.invoice}</TableCell>
            <TableCell>{invoice.paymentStatus}</TableCell>
            <TableCell>{invoice.paymentMethod}</TableCell>
            <TableCell className="text-right">{invoice.totalAmount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">$2,500.00</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  )
}
*/
