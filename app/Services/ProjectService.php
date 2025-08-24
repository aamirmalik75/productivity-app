<?php

namespace App\Services;

use App\Models\Project;

class ProjectService
{
  public function getProjectWithTasks($project_id, $user_id)
  {
    $project = Project::where('user_id', $user_id)
      ->where('id', $project_id)
      ->where('inTrash', 0)
      ->with('tasks')
      ->first();

    if (!$project) {
      return null;
    }

    $tasksGrouped = $project->tasks->groupBy('field');

    $fields = [
      'To-Do' => [],
      'In-Progress' => [],
      'Done' => [],
    ];

    foreach ($fields as $key => &$value) {
      if ($tasksGrouped->has($key)) {
        $value = $tasksGrouped->get($key);
      }
    }

    return [
      'id' => $project->id,
      'name' => $project->name,
      'url' => $project->url,
      'last_opened' => $project->last_opened,
      'inTrash' => $project->inTrash,
      'fields' => $fields
    ];
  }
}
