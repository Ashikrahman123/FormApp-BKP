
import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Animated,
  Alert
} from 'react-native';
import { router } from 'expo-router';
import { useDeclarationStore } from '@/stores/declarationStore';
import { FileText, AlertCircle, Edit, Trash } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { Declaration } from '@/types/declaration';
import { useTheme } from '@/context/ThemeContext';

export default function DeclarationsScreen() {
  const declarationStore = useDeclarationStore();
  const { declarations, getDeclarations, deleteDeclaration, isLoading } = declarationStore;
  const { theme } = useTheme();
  const colors = theme === 'dark' ? Colors.dark : Colors.light;
  const fadeAnim = new Animated.Value(0);

  React.useEffect(() => {
    getDeclarations();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleRefresh = useCallback(async () => {
    await getDeclarations();
  }, [getDeclarations]);

  const handleEdit = useCallback((id: string) => {
    router.push(`/declaration/${id}`);
  }, []);

  const handleDelete = useCallback((id: string) => {
    Alert.alert(
      'Delete Declaration',
      'Are you sure you want to delete this declaration?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteDeclaration(id);
            getDeclarations();
          }
        }
      ]
    );
  }, [deleteDeclaration, getDeclarations]);

  const renderItem = ({ item, index }: { item: Declaration; index: number }) => {
    const itemFadeAnim = new Animated.Value(0);
    const itemTranslateAnim = new Animated.Value(50);

    React.useEffect(() => {
      const delay = index * 100;
      Animated.parallel([
        Animated.timing(itemFadeAnim, {
          toValue: 1,
          duration: 500,
          delay,
          useNativeDriver: true,
        }),
        Animated.timing(itemTranslateAnim, {
          toValue: 0,
          duration: 400,
          delay,
          useNativeDriver: true,
        }),
      ]).start();
    }, []);

    return (
      <Animated.View
        style={[{
          opacity: itemFadeAnim,
          transform: [{ translateY: itemTranslateAnim }],
        }]}
      >
        <TouchableOpacity 
          style={[styles.card, { backgroundColor: colors.card }]}
          onPress={() => handleEdit(item.id)}
        >
          <View style={styles.cardHeader}>
            <FileText size={20} color={colors.primary} />
            <Text style={[styles.cardTitle, { color: colors.text }]}>
              Transaction #{item.transactionNo}
            </Text>
          </View>
          
          <View style={styles.cardContent}>
            <View style={styles.cardRow}>
              <Text style={[styles.cardLabel, { color: colors.placeholder }]}>Name:</Text>
              <Text style={[styles.cardValue, { color: colors.text }]}>{item.name}</Text>
            </View>
            <View style={styles.cardRow}>
              <Text style={[styles.cardLabel, { color: colors.placeholder }]}>Date:</Text>
              <Text style={[styles.cardValue, { color: colors.text }]}>{item.transactionDate}</Text>
            </View>
            <View style={styles.cardRow}>
              <Text style={[styles.cardLabel, { color: colors.placeholder }]}>ID:</Text>
              <Text style={[styles.cardValue, { color: colors.text }]}>{item.idNo}</Text>
            </View>
          </View>

          <View style={[styles.cardFooter, { borderTopColor: colors.border }]}>
            <Text style={[styles.cardDate, { color: colors.placeholder }]}>
              Created: {new Date(item.createdAt).toLocaleDateString()}
            </Text>
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={[styles.actionButton, { backgroundColor: colors.primary }]}
                onPress={() => handleEdit(item.id)}
              >
                <Edit size={16} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.actionButton, { backgroundColor: colors.error }]}
                onPress={() => handleDelete(item.id)}
              >
                <Trash size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderEmptyList = () => (
    <Animated.View style={[styles.emptyContainer, { opacity: fadeAnim }]}>
      <AlertCircle size={60} color={colors.inactive} />
      <Text style={[styles.emptyTitle, { color: colors.text }]}>
        No Declarations Yet
      </Text>
      <Text style={[styles.emptyText, { color: colors.placeholder }]}>
        Create your first declaration by tapping the Create tab below.
      </Text>
    </Animated.View>
  );

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.text }]}>
          Loading declarations...
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={declarations}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyList}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    flexGrow: 1,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  cardContent: {
    marginBottom: 12,
  },
  cardRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  cardLabel: {
    fontSize: 14,
    width: 60,
  },
  cardValue: {
    fontSize: 14,
    flex: 1,
  },
  cardFooter: {
    borderTopWidth: 1,
    paddingTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardDate: {
    fontSize: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 6,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
  },
});
