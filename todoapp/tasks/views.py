from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from .models import Task
from .forms import TaskForm
from django.contrib import messages

@login_required
def index(request):
    tasks = Task.objects.filter(user=request.user).order_by('-priority', 'complete', 'created')
    form = TaskForm()
    
    if request.method == 'POST':
        form = TaskForm(request.POST)
        if form.is_valid():
            task = form.save(commit=False)
            task.user = request.user
            task.save()
            messages.success(request, 'Task added successfully!')
            return redirect('index')
    
    context = {'tasks': tasks, 'form': form}
    return render(request, 'tasks/index.html', context)

@login_required
def update_task(request, pk):
    task = Task.objects.get(id=pk)
    
    if task.user != request.user:
        return JsonResponse({'error': 'Unauthorized'}, status=403)
    
    if request.method == 'POST':
        form = TaskForm(request.POST, instance=task)
        if form.is_valid():
            form.save()
            return JsonResponse({'success': True})
        return JsonResponse({'errors': form.errors}, status=400)
    
    form = TaskForm(instance=task)
    return JsonResponse({
        'title': task.title,
        'description': task.description,
        'due_date': task.due_date.strftime('%Y-%m-%dT%H:%M') if task.due_date else None,
        'priority': task.priority,  # Added priority field
        'complete': task.complete
    })

@login_required
def delete_task(request, pk):
    task = Task.objects.get(id=pk)
    
    if task.user != request.user:
        return JsonResponse({'error': 'Unauthorized'}, status=403)
    
    if request.method == 'POST':
        task.delete()
        return JsonResponse({'success': True})
    
    return JsonResponse({'error': 'Invalid request'}, status=400)

@login_required
def toggle_task(request, pk):
    task = Task.objects.get(id=pk)
    
    if task.user != request.user:
        return JsonResponse({'error': 'Unauthorized'}, status=403)
    
    task.complete = not task.complete
    task.save()
    return JsonResponse({
        'success': True, 
        'complete': task.complete,
        'priority': task.priority  # Added for frontend updates
    })