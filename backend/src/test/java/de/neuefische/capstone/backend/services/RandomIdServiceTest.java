package de.neuefische.capstone.backend.services;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import java.lang.reflect.Constructor;
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
        Assertions.assertEquals(String.class, uuidList.get(0).getClass());
        assertEquals(uuidList.size(), uuidSet.size());
    }

    @Test
    void testUtilityClassConstructorThrowsException() throws ReflectiveOperationException {
        // GIVEN
        Class<RandomIdService> clazz = RandomIdService.class;

        Constructor<RandomIdService> constructor = clazz.getDeclaredConstructor();
        constructor.setAccessible(true);
        // WHEN & THEN
        Assertions.assertThrows(ReflectiveOperationException.class, ()->constructor.newInstance());
    }
}