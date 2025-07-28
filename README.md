# 🚀 Django To-Do App with User Authentication

![Django](https://img.shields.io/badge/Django-092E20?logo=django&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?logo=python&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-563D7C?logo=bootstrap&logoColor=white)

A full-featured task management system built with Django during a 4-day intensive bootcamp. Features secure authentication, priority tasks, and responsive design.

## ✨ Key Features

- 🔒 **User Authentication**
  - Email/password login & registration
  - Google OAuth integration
  - Password reset functionality

- ✅ **Task Management**
  - Create, read, update, and delete tasks
  - Priority levels (High/Medium/Low) with color-coding
  - Due date tracking
  - Mark tasks as complete

- 📱 **Responsive Design**
  - Mobile-friendly interface
  - Clean Bootstrap 5 UI

## 🛠️ Quick Start

1. **Clone the repo**
   ```bash
   git clone https://github.com/SrijanGupta0-0/Task-Organizer.git
   cd django-todo-app
   ```

2. **Set up environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # Linux/Mac
   venv\Scripts\activate     # Windows
   pip install -r requirements.txt
   ```

3. **Configure and run**
   ```bash
   python manage.py migrate
   python manage.py createsuperuser
   python manage.py runserver
   ```
   Visit `http://localhost:8000`


## 🌟 What I Learned

- Implemented Django's authentication system
- Integrated third-party OAuth (Google)
- Built CRUD functionality with Django ORM
- Created responsive UIs with Bootstrap

## 📂 Project Structure

```
django-todo-app/
├── todoapp/       # Project config
├── tasks/         # Main app
│   ├── migrations/
│   ├── static/    # CSS/JS
│   ├── templates/ # HTML
│   ├── admin.py   # Admin config
│   ├── models.py  # Database models
│   └── views.py   # Business logic
└── manage.py      # Django CLI
```

## 🤝 Contributing

Pull requests welcome! For major changes, please open an issue first.


Built during Django Bootcamp at Cimage College | [2025]
```

### Key Features:
1. **Visual Appeal**: Badges and clean formatting
2. **Quick Setup**: Minimal steps to run the project
3. **Learning Highlight**: Showcases your bootcamp takeaways
4. **Mobile-Friendly**: Responsive design mentioned
5. **Professional Structure**: Clear sections for features/installation

