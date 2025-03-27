import AsyncStorage from '@react-native-async-storage/async-storage';

class StorageService {
  private static instance: StorageService;

  private constructor() {}

  // Ensure only one instance is created
  public static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  // Method to set a value in AsyncStorage
  public async setItem(key: string, value: string): Promise<void> {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error('Error setting item in AsyncStorage:', error);
    }
  }

  // Method to get a value from AsyncStorage
  public async getItem(key: string): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error('Error getting item from AsyncStorage:', error);
      return null;
    }
  }

  // Method to remove an item from AsyncStorage
  public async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing item from AsyncStorage:', error);
    }
  }

  // Method to clear all data in AsyncStorage
  public async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing AsyncStorage:', error);
    }
  }
}

export const asyncStorage = StorageService.getInstance();