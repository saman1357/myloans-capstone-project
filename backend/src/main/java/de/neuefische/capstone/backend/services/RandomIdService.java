package de.neuefische.capstone.backend.services;

import java.util.UUID;

public final class RandomIdService {


    public static String uuid(){
        return UUID.randomUUID().toString();
    }

    private RandomIdService() {
        throw new IllegalStateException("This utility class should not be instantiated.");
    }
}
