import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { MapPin, TrendingUp, Users } from "lucide-react";

const mockAssets = [
  {
    id: 1,
    name: "Manhattan Luxury Apartment",
    location: "New York, NY",
    price: "$2,500,000",
    tokenPrice: "$250",
    totalTokens: "10,000",
    availableTokens: "3,247",
    yield: "7.2%",
    image: "/placeholder.svg?height=200&width=300",
    status: "Available",
  },
  {
    id: 2,
    name: "Miami Beach Condo",
    location: "Miami, FL",
    price: "$1,800,000",
    tokenPrice: "$180",
    totalTokens: "10,000",
    availableTokens: "1,856",
    yield: "8.5%",
    image: "/placeholder.svg?height=200&width=300",
    status: "Available",
  },
  {
    id: 3,
    name: "Silicon Valley Office",
    location: "San Jose, CA",
    price: "$5,200,000",
    tokenPrice: "$520",
    totalTokens: "10,000",
    availableTokens: "892",
    yield: "6.8%",
    image: "/placeholder.svg?height=200&width=300",
    status: "Limited",
  },
  {
    id: 4,
    name: "Austin Residential Complex",
    location: "Austin, TX",
    price: "$3,100,000",
    tokenPrice: "$310",
    totalTokens: "10,000",
    availableTokens: "5,643",
    yield: "9.1%",
    image: "/placeholder.svg?height=200&width=300",
    status: "Available",
  },
];

export function AssetGrid() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Featured Properties
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover premium real estate investment opportunities tokenized on
            Hedera
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {mockAssets.map((asset) => (
            <Card
              key={asset.id}
              className="overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative">
                <img
                  src={asset.image || "/placeholder.svg"}
                  alt={asset.name}
                  className="w-full h-48 object-cover"
                />
                <Badge
                  className="absolute top-3 right-3"
                  variant={
                    asset.status === "Limited" ? "destructive" : "default"
                  }
                >
                  {asset.status}
                </Badge>
              </div>

              <CardHeader className="pb-3">
                <CardTitle className="text-lg line-clamp-1">
                  {asset.name}
                </CardTitle>
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-1" />
                  {asset.location}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Total Value
                  </span>
                  <span className="font-semibold">{asset.price}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Token Price
                  </span>
                  <span className="font-semibold text-primary">
                    {asset.tokenPrice}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Available
                  </span>
                  <span className="text-sm">
                    {asset.availableTokens}/{asset.totalTokens}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                    <span className="text-sm font-medium text-green-600">
                      {asset.yield} Yield
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="h-4 w-4 mr-1" />
                    <span>
                      {Number.parseInt(asset.totalTokens) -
                        Number.parseInt(asset.availableTokens)}
                    </span>
                  </div>
                </div>

                <Button className="w-full" size="sm">
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            View All Properties
          </Button>
        </div>
      </div>
    </section>
  );
}
