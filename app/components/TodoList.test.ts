/**
 * Vitestのテストファイル - TodoListコンポーネント
 * 
 * このファイルはVitestを使用してTodoListコンポーネントの動作をテストします
 */

// Vitestから必要な関数をインポート
import { describe, it, expect, vi } from 'vitest'
// describe: テストスイート（テストのグループ）を定義
// it: 個別のテストケースを定義
// expect: アサーション（期待値の検証）を行う
// vi: モック関数やスパイを作成するためのユーティリティ

// Vue Test Utilsからmount関数をインポート
import { mount } from '@vue/test-utils'
// mount: Vueコンポーネントをテスト環境でマウント（レンダリング）する

import TodoList from './TodoList.vue'
import TodoItem from './TodoItem.vue'
import { createMockTodos } from '../../tests/helpers' // テスト用のダミーTodoを生成するヘルパー関数

// useTodosコンポーザブルをモック化
const mockTodos = ref(createMockTodos(3)) // 3つのダミーTodoを作成
const mockFilter = ref('all') // フィルターの初期値

// vi.mock: モジュール全体をモック化する
// 実際のuseTodosの代わりに、テスト用のモックデータを返す
vi.mock('~/composables/useTodos', () => ({
    useTodos: () => ({
        todos: mockTodos,
        filter: mockFilter,
    }),
}))

// describe: テストスイートの定義（関連するテストケースをグループ化）
describe('TodoList', () => {
    // テストケース1: Todoリストが正しくレンダリングされるか
    it('renders list of todos', () => {
        const wrapper = mount(TodoList) // コンポーネントをマウント

        // findAllComponents: 指定したコンポーネントのすべてのインスタンスを取得
        const todoItems = wrapper.findAllComponents(TodoItem)
        expect(todoItems).toHaveLength(3) // TodoItemが3つレンダリングされていることを確認
    })

    // テストケース2: TodoItemに正しいpropsが渡されるか
    it('passes correct props to TodoItem', () => {
        const wrapper = mount(TodoList)

        // 最初のTodoItemコンポーネントを取得（!は非null断言演算子）
        const firstItem = wrapper.findAllComponents(TodoItem)[0]!
        // props(): コンポーネントに渡されたpropsの値を取得
        expect(firstItem.props('todo')).toEqual(mockTodos.value[0])
    })

    // テストケース3: Todoがないときに空の状態が表示されるか
    it('shows empty state when no todos', () => {
        mockTodos.value = [] // Todoリストを空にする
        const wrapper = mount(TodoList)

        // empty-state クラスを持つ要素が存在することを確認
        expect(wrapper.find('.empty-state').exists()).toBe(true)
        // テキストに「No todos yet」が含まれることを確認
        expect(wrapper.text()).toContain('No todos yet')
    })

    // テストケース4: Todoがあるときに空の状態が表示されないか
    it('does not show empty state when there are todos', () => {
        mockTodos.value = createMockTodos(2) // 2つのTodoを作成
        const wrapper = mount(TodoList)

        // 空の状態が表示されないことを確認
        expect(wrapper.find('.empty-state').exists()).toBe(false)
    })

    // テストケース5: 「all」フィルター時の空メッセージが正しいか
    it('shows correct empty message for "all" filter', () => {
        mockTodos.value = [] // Todoリストを空にする
        mockFilter.value = 'all' // フィルターを「all」に設定
        const wrapper = mount(TodoList)

        // 「all」フィルター用のメッセージが表示されることを確認
        expect(wrapper.text()).toContain('No todos yet. Add one to get started!')
    })

    // テストケース6: 「active」フィルター時の空メッセージが正しいか
    it('shows correct empty message for "active" filter', () => {
        mockTodos.value = []
        mockFilter.value = 'active' // フィルターを「active」に設定
        const wrapper = mount(TodoList)

        // 「active」フィルター用のメッセージが表示されることを確認
        expect(wrapper.text()).toContain('No active todos. Great job!')
    })

    // テストケース7: 「completed」フィルター時の空メッセージが正しいか
    it('shows correct empty message for "completed" filter', () => {
        mockTodos.value = []
        mockFilter.value = 'completed' // フィルターを「completed」に設定
        const wrapper = mount(TodoList)

        // 「completed」フィルター用のメッセージが表示されることを確認
        expect(wrapper.text()).toContain('No completed todos yet')
    })

    // テストケース8: TodoがTransitionGroupでレンダリングされるか
    it('renders todos with TransitionGroup', () => {
        mockTodos.value = createMockTodos(2)
        const wrapper = mount(TodoList)

        // TransitionGroupのコンテナ要素が存在することを確認
        expect(wrapper.find('.todo-items').exists()).toBe(true)
    })
})
