<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
  /**
   * Run the migrations.
   *
   * @return void
   */
  public function up()
  {
    Schema::create('projects', function (Blueprint $table) {
      $table->id();
      $table->string("name")->default('Untitled');
      $table->string("url")->nullable();
      $table->timestamp("last_opened")->nullable();
      $table->boolean("inTrash")->default(0);
      $table->json("fields")->change()->default(json_encode(["To-Do", "In-Progress", "Done"]));
      $table->unsignedBigInteger('user_id');
      $table->foreign("user_id")->references("id")->on("users")->onDelete('cascade');
      $table->timestamps();
    });

  }

  /**
   * Reverse the migrations.
   *
   * @return void
   */
  public function down()
  {
    Schema::dropIfExists('projects');
  }
};
