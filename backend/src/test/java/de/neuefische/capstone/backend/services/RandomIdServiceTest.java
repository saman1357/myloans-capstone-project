package de.neuefische.capstone.backend.services;

import org.junit.jupiter.api.Test;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

class RandomIdServiceTest {

    @Test
    void ReturnUniqueStrings_whenUuidIsCalled() {
        //GIVEN
        List<String> uuidList = List.of(RandomIdService.uuid(), RandomIdService.uuid(), RandomIdService.uuid(), RandomIdService.uuid(),RandomIdService.uuid());
        //WHEN
        Set<String> uuidSet= new HashSet<>(uuidList);
        //THEN
        assertEquals(uuidList.size(), uuidSet.size());
    }
}