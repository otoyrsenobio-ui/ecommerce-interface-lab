import java.util.*;
import java.util.stream.Collectors;

// Record 
record Order(Long orderId, String description, int amount) {
}

public class Exercise2 {

    static List<Order> orderGenerator(int numberOfOrders) {
        if (numberOfOrders <= 0) {
            throw new RuntimeException("Number of orders must be positive");
        }
        var generatedOrder = new ArrayList<Order>();
        for (var i = 0; i < numberOfOrders; i++) {
            long orderId = (int) (Math.random() * 10);
            generatedOrder.add(new Order(
                    orderId,
                    "Order" + orderId,
                    (int) (Math.random() * 200)));
        }
        return generatedOrder;
    }

    public static void main(String[] args) {
        // 1. Generate 10 orders and print all
        List<Order> orders = orderGenerator(10);
        System.out.println("=== All Orders (unsorted) ===");
        orders.forEach(o -> System.out.printf("ID: %d, Desc: %s, Amount: %d%n",
                o.orderId(), o.description(), o.amount()));

        // 2. Add one order, sort by amount descending (lambda)
        Order newOrder = new Order(99L, "SpecialOrder", 250);
        orders.add(newOrder);
        orders.sort((a, b) -> Integer.compare(b.amount(), a.amount()));
        System.out.println("\n=== Sorted by Amount (descending) ===");
        orders.forEach(o -> System.out.printf("ID: %d, Desc: %s, Amount: %d%n",
                o.orderId(), o.description(), o.amount()));

        // 3. Stream
        System.out.println("\n=== Orders with amount > 150 (descriptions only) ===");
        List<String> highValueDescriptions = orders.stream()
                .filter(o -> o.amount() > 150)
                .map(Order::description)
                .collect(Collectors.toList());
        highValueDescriptions.forEach(System.out::println);

        // 4. Stream
        double average = orders.stream()
                .mapToInt(Order::amount)
                .average()
                .orElse(0.0);
        System.out.printf("\nAverage order amount: %.2f%n", average);

        // 5. Stream
        System.out.println("\n=== Total amount per description ===");
        Map<String, Integer> sumByDesc = orders.stream()
                .collect(Collectors.groupingBy(
                        Order::description,
                        Collectors.summingInt(Order::amount)));
        sumByDesc.forEach((desc, total) -> System.out.printf("%s -> %d%n", desc, total));
    }
}