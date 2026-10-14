package com.passgen.passgen.service;

import org.springframework.stereotype.Service;
import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
public class PasswordService {

    private final SecureRandom random = new SecureRandom();

    private static final String LOWER = "abcdefghijklmnopqrstuvwxyz";
    private static final String UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    private static final String NUMBERS = "0123456789";
    private static final String SYMBOLS = "!@#$%^&*()-_=+";

    public String generate(int length, boolean lower,
                           boolean upper, boolean numbers,
                           boolean symbols) {

        if (length < 4 || length > 128) {
            throw new IllegalArgumentException(
                "Length must be between 4 and 128."
            );
        }

        StringBuilder pool = new StringBuilder();
        List<Character> result = new ArrayList<>();

        if (lower) {
            pool.append(LOWER);
            result.add(randomChar(LOWER));
        }

        if (upper) {
            pool.append(UPPER);
            result.add(randomChar(UPPER));
        }

        if (numbers) {
            pool.append(NUMBERS);
            result.add(randomChar(NUMBERS));
        }

        if (symbols) {
            pool.append(SYMBOLS);
            result.add(randomChar(SYMBOLS));
        }

        if (pool.isEmpty()) {
            throw new IllegalArgumentException(
                "Select at least one character type."
            );
        }

        while (result.size() < length) {
            result.add(randomChar(pool.toString()));
        }

        Collections.shuffle(result, random);

        StringBuilder password = new StringBuilder();

        for (char c : result) {
            password.append(c);
        }

        return password.toString();
    }

    private char randomChar(String characters) {
        return characters.charAt(
            random.nextInt(characters.length())
        );
    }
}