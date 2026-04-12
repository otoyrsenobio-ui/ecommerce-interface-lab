import java.math.BigDecimal;

class InvalidInputException extends Exception {
    public InvalidInputException(String message) {
        super(message);
    }
}

class InsufficientFundsException extends Exception {
    public InsufficientFundsException(String message) {
        super(message);
    }
}

interface InterestBearing {
    BigDecimal calculateInterest();
}

// Abstract class
abstract class Account {
    protected BigDecimal balance; // encapsulation

    public Account(BigDecimal initialBalance) throws InvalidInputException {
        if (initialBalance.compareTo(BigDecimal.ZERO) < 0)
            throw new InvalidInputException("Initial balance cannot be negative");
        this.balance = initialBalance;
    }

    public abstract void deposit(BigDecimal amount) throws InvalidInputException;

    public abstract void withdraw(BigDecimal amount) throws InvalidInputException, InsufficientFundsException;

    public BigDecimal getBalance() {
        return balance;
    }
}

// SavingsAccount
class SavingsAccount extends Account implements InterestBearing {
    private static final BigDecimal INTEREST_RATE = new BigDecimal("0.03");

    public SavingsAccount(BigDecimal initialBalance) throws InvalidInputException {
        super(initialBalance);
    }

    @Override
    public void deposit(BigDecimal amount) throws InvalidInputException {
        if (amount.compareTo(BigDecimal.ZERO) <= 0)
            throw new InvalidInputException("Deposit amount must be positive");
        balance = balance.add(amount);
        System.out.println("Deposited: " + amount + " | New balance: " + balance);
    }

    @Override
    public void withdraw(BigDecimal amount) throws InvalidInputException, InsufficientFundsException {
        if (amount.compareTo(BigDecimal.ZERO) <= 0)
            throw new InvalidInputException("Withdrawal amount must be positive");
        if (amount.compareTo(balance) > 0)
            throw new InsufficientFundsException("Insufficient funds. Available: " + balance);
        balance = balance.subtract(amount);
        System.out.println("Withdrew: " + amount + " | New balance: " + balance);
    }

    @Override
    public BigDecimal calculateInterest() {
        return balance.multiply(INTEREST_RATE).setScale(2, BigDecimal.ROUND_HALF_EVEN);
    }
}

// CheckingAccount
class CheckingAccount extends Account {
    public CheckingAccount(BigDecimal initialBalance) throws InvalidInputException {
        super(initialBalance);
    }

    @Override
    public void deposit(BigDecimal amount) throws InvalidInputException {
        if (amount.compareTo(BigDecimal.ZERO) <= 0)
            throw new InvalidInputException("Deposit amount must be positive");
        balance = balance.add(amount);
        System.out.println("Deposited: " + amount + " | New balance: " + balance);
    }

    @Override
    public void withdraw(BigDecimal amount) throws InvalidInputException, InsufficientFundsException {
        if (amount.compareTo(BigDecimal.ZERO) <= 0)
            throw new InvalidInputException("Withdrawal amount must be positive");
        if (amount.compareTo(balance) > 0)
            throw new InsufficientFundsException("Insufficient funds. Available: " + balance);
        balance = balance.subtract(amount);
        System.out.println("Withdrew: " + amount + " | New balance: " + balance);
    }
}

// Main class
public class Exercise1 {
    public static void main(String[] args) {
        try {
            SavingsAccount savings = new SavingsAccount(new BigDecimal("1000.00"));
            CheckingAccount checking = new CheckingAccount(new BigDecimal("500.00"));

            System.out.println("=== Savings Account ===");
            savings.deposit(new BigDecimal("200.00"));
            savings.withdraw(new BigDecimal("150.00"));
            System.out.println("Interest earned: " + savings.calculateInterest());

            System.out.println("\n=== Checking Account ===");
            checking.deposit(new BigDecimal("100.00"));
            checking.withdraw(new BigDecimal("700.00")); // triggers exception

        } catch (InvalidInputException | InsufficientFundsException e) {
            System.err.println("Error: " + e.getMessage());
        }

        try {
            new SavingsAccount(new BigDecimal("-50"));
        } catch (InvalidInputException e) {
            System.err.println("\nExpected error: " + e.getMessage());
        }
    }
}