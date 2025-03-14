<template>
    <div class="notes-editor">
        <h2>Редактор Заметок</h2>
        <button @click="logout" class="logout-button">Выйти</button>


        <form @submit.prevent="submitNote" class="note-form">
            <div>
                <label for="title">Заголовок:</label>
                <input type="text" id="title" v-model="currentNote.title" required placeholder="Введите заголовок" />
            </div>
            <div>
                <label for="content">Содержание:</label>
                <textarea id="content" v-model="currentNote.content" required
                    placeholder="Введите содержание"></textarea>
            </div>
            <button type="submit">{{ isEditing ? 'Обновить Заметку' : 'Добавить Заметку' }}</button>
            <button type="button" v-if="isEditing" @click="cancelEdit" class="cancel-button">
                Отмена
            </button>
        </form>


        <div class="notes-list" v-if="notes.length">
            <h3>Ваши Заметки:</h3>
            <ul>
                <li v-for="note in notes" :key="note.id" class="note-item">
                    <h4>{{ note.title }}</h4>
                    <p>{{ note.content }}</p>
                    <div class="note-actions">
                        <button @click="editNote(note)">Редактировать</button>
                        <button @click="deleteNote(note.id)" class="delete-button">Удалить</button>
                    </div>
                </li>
            </ul>
        </div>
        <p v-else>У вас ещё нет заметок. Добавьте новую заметку выше.</p>
    </div>
</template>

<script>
export default {
    name: 'NotesEditor',
    data() {
        return {
            notes: [],
            currentNote: {
                id: null,
                title: '',
                content: ''
            },
            isEditing: false
        };
    },
    created() {
        this.loadNotes();
    },
    methods: {
        loadNotes() {
            const user = JSON.parse(localStorage.getItem('user'));
            if (user) {
                const savedNotes = JSON.parse(localStorage.getItem(`notes_${user.email}`)) || [];
                this.notes = savedNotes;
            }
        },
        saveNotes() {
            const user = JSON.parse(localStorage.getItem('user'));
            if (user) {
                localStorage.setItem(`notes_${user.email}`, JSON.stringify(this.notes));
            }
        },
        submitNote() {
            if (this.isEditing) {
                // Обновление существующей заметки
                const index = this.notes.findIndex(note => note.id === this.currentNote.id);
                if (index !== -1) {
                    this.notes.splice(index, 1, { ...this.currentNote });
                    this.saveNotes();
                    this.resetForm();
                }
            } else {
                // Добавление новой заметки
                const newNote = {
                    id: Date.now(),
                    title: this.currentNote.title,
                    content: this.currentNote.content
                };
                this.notes.push(newNote);
                this.saveNotes();
                this.resetForm();
            }
        },
        editNote(note) {
            this.currentNote = { ...note };
            this.isEditing = true;
        },
        cancelEdit() {
            this.resetForm();
        },
        deleteNote(id) {
            if (confirm('Вы уверены, что хотите удалить эту заметку?')) {
                this.notes = this.notes.filter(note => note.id !== id);
                this.saveNotes();
            }
        },
        logout() {
            localStorage.removeItem('user');
            this.$router.push('/');
        },
        resetForm() {
            this.currentNote = {
                id: null,
                title: '',
                content: ''
            };
            this.isEditing = false;
        }
    }
};
</script>

<style scoped>
.notes-editor {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
}

.logout-button {
    float: right;
    background-color: #f44336;
    color: white;
    border: none;
    padding: 8px 12px;
    cursor: pointer;
    border-radius: 4px;
}

.note-form {
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
}

.note-form div {
    margin-bottom: 10px;
}

.note-form label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
}

.note-form input,
.note-form textarea {
    width: 100%;
    padding: 8px;
    box-sizing: border-box;
}

.note-form button {
    width: 150px;
    padding: 10px;
    margin-right: 10px;
    background-color: #4caf50;
    color: white;
    border: none;
    cursor: pointer;
    border-radius: 4px;
}

.cancel-button {
    background-color: #9e9e9e;
}

.notes-list ul {
    list-style-type: none;
    padding: 0;
}

.note-item {
    border: 1px solid #ddd;
    padding: 15px;
    margin-bottom: 10px;
    border-radius: 4px;
    position: relative;
}

.note-actions {
    position: absolute;
    top: 15px;
    right: 15px;
}

.note-actions button {
    margin-left: 5px;
    padding: 5px 10px;
    background-color: #2196f3;
    color: white;
    border: none;
    cursor: pointer;
    border-radius: 4px;
}

.delete-button {
    background-color: #f44336;
}
</style>